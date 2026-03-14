# CQRS Testing Strategies

## Table of Contents

1. [Unit Testing Handlers](#unit-testing-handlers)
2. [Integration Testing](#integration-testing)
3. [Testing Commands and Queries](#testing-commands-and-queries)
4. [Mocking Strategies](#mocking-strategies)
5. [Test Data Builders](#test-data-builders)
6. [E2E Testing](#e2e-testing)

## Unit Testing Handlers

### Command Handler Test Template

```typescript
describe("CreateUserHandler", () => {
    let handler: CreateUserHandler;
    let prismaService: jest.Mocked<PrismaService>;

    beforeEach(() => {
        prismaService = {
            user: {
                create: jest.fn(),
                findUnique: jest.fn()
            }
        } as any;

        handler = new CreateUserHandler(prismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("execute", () => {
        it("should create user successfully", async () => {
            // Arrange
            const command = new CreateUserCommand(
                "test@example.com",
                "Test User"
            );
            const expectedUser = {
                id: "1",
                email: "test@example.com",
                name: "Test User",
                createdAt: new Date()
            };

            prismaService.user.create.mockResolvedValue(expectedUser);

            // Act
            const result = await handler.execute(command);

            // Assert
            expect(result.id).toBe("1");
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    email: "test@example.com",
                    name: "Test User"
                }
            });
            expect(prismaService.user.create).toHaveBeenCalledTimes(1);
        });

        it("should throw error when email already exists", async () => {
            // Arrange
            const command = new CreateUserCommand(
                "test@example.com",
                "Test User"
            );
            prismaService.user.create.mockRejectedValue(
                new Error("Unique constraint failed")
            );

            // Act & Assert
            await expect(handler.execute(command)).rejects.toThrow();
            expect(prismaService.user.create).toHaveBeenCalledTimes(1);
        });
    });
});
```

### Query Handler Test Template

```typescript
describe("GetUserByIdHandler", () => {
    let handler: GetUserByIdHandler;
    let prismaService: jest.Mocked<PrismaService>;

    beforeEach(() => {
        prismaService = {
            user: {
                findFirst: jest.fn()
            }
        } as any;

        handler = new GetUserByIdHandler(prismaService);
    });

    describe("execute", () => {
        it("should return user when found", async () => {
            // Arrange
            const query = new GetUserByIdQuery("1");
            const expectedUser = {
                id: "1",
                email: "test@example.com",
                name: "Test User"
            };

            prismaService.user.findFirst.mockResolvedValue(expectedUser);

            // Act
            const result = await handler.execute(query);

            // Assert
            expect(result.user).toEqual(expectedUser);
            expect(result.result).toBe("OK");
            expect(prismaService.user.findFirst).toHaveBeenCalledWith({
                where: { id: "1" }
            });
        });

        it("should throw BadRequestException when user not found", async () => {
            // Arrange
            const query = new GetUserByIdQuery("999");
            prismaService.user.findFirst.mockResolvedValue(null);

            // Act & Assert
            await expect(handler.execute(query)).rejects.toThrow(
                BadRequestException
            );
            await expect(handler.execute(query)).rejects.toThrow(
                "user not found"
            );
        });
    });
});
```

## Integration Testing

### Service Integration Test

```typescript
describe("UserService (Integration)", () => {
    let service: UserService;
    let commandBus: CommandBus;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [CqrsModule],
            providers: [
                UserService,
                ...CommandHandlers,
                ...QueryHandlers,
                { provide: "PrismaService", useClass: PrismaService }
            ]
        }).compile();

        service = module.get<UserService>(UserService);
        commandBus = module.get<CommandBus>(CommandBus);
        queryBus = module.get<QueryBus>(QueryBus);
    });

    describe("createUser", () => {
        it("should create user through command bus", async () => {
            // Arrange
            const executeSpy = jest
                .spyOn(commandBus, "execute")
                .mockResolvedValue({ id: "1" });

            // Act
            const result = await service.createUser(
                "test@example.com",
                "Test User"
            );

            // Assert
            expect(result.id).toBe("1");
            expect(executeSpy).toHaveBeenCalledWith(
                expect.any(CreateUserCommand)
            );
        });
    });

    describe("getUserById", () => {
        it("should get user through query bus", async () => {
            // Arrange
            const expectedUser = {
                id: "1",
                email: "test@example.com",
                name: "Test User"
            };
            const executeSpy = jest
                .spyOn(queryBus, "execute")
                .mockResolvedValue({ result: "OK", user: expectedUser });

            // Act
            const result = await service.getUserById("1");

            // Assert
            expect(result.user).toEqual(expectedUser);
            expect(executeSpy).toHaveBeenCalledWith(
                expect.any(GetUserByIdQuery)
            );
        });
    });
});
```

### Controller Integration Test

```typescript
describe("UserController (Integration)", () => {
    let controller: UserController;
    let service: jest.Mocked<UserService>;

    beforeEach(async () => {
        const mockService = {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            updateUserProfile: jest.fn(),
            deleteUser: jest.fn()
        };

        const module = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: "UserService", useValue: mockService }]
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get("UserService");
    });

    describe("createUser", () => {
        it("should call service.createUser with correct parameters", async () => {
            // Arrange
            const dto = { email: "test@example.com", name: "Test User" };
            service.createUser.mockResolvedValue({ id: "1" });

            // Act
            const result = await controller.createUser(dto);

            // Assert
            expect(result.id).toBe("1");
            expect(service.createUser).toHaveBeenCalledWith(
                "test@example.com",
                "Test User"
            );
        });
    });

    describe("getUserById", () => {
        it("should return user from service", async () => {
            // Arrange
            const expectedUser = {
                result: "OK",
                user: { id: "1", email: "test@example.com", name: "Test" }
            };
            service.getUserById.mockResolvedValue(expectedUser);

            // Act
            const result = await controller.getUserById("1");

            // Assert
            expect(result).toEqual(expectedUser);
            expect(service.getUserById).toHaveBeenCalledWith("1");
        });
    });
});
```

## Testing Commands and Queries

### Command Test

```typescript
describe("CreateUserCommand", () => {
    it("should create command with correct properties", () => {
        // Act
        const command = new CreateUserCommand("test@example.com", "Test User");

        // Assert
        expect(command.email).toBe("test@example.com");
        expect(command.name).toBe("Test User");
        expect(command).toBeInstanceOf(CreateUserCommand);
    });

    it("should be immutable", () => {
        // Arrange
        const command = new CreateUserCommand("test@example.com", "Test User");

        // Act & Assert
        expect(() => {
            (command as any).email = "new@example.com";
        }).toThrow();
    });
});
```

### Query Test

```typescript
describe("GetUserByIdQuery", () => {
    it("should create query with correct id", () => {
        // Act
        const query = new GetUserByIdQuery("123");

        // Assert
        expect(query.id).toBe("123");
        expect(query).toBeInstanceOf(GetUserByIdQuery);
    });
});
```

## Mocking Strategies

### Mocking PrismaService

```typescript
// test/mocks/prisma.mock.ts
export const createMockPrismaService = () => ({
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn()
    },
    post: {
        create: jest.fn(),
        findMany: jest.fn()
    },
    $transaction: jest.fn(callback =>
        callback({
            user: {
                findUnique: jest.fn(),
                update: jest.fn()
            }
        })
    )
});

// Usage in test
describe("UpdateUserHandler", () => {
    let handler: UpdateUserHandler;
    let prisma: ReturnType<typeof createMockPrismaService>;

    beforeEach(() => {
        prisma = createMockPrismaService();
        handler = new UpdateUserHandler(prisma as any);
    });

    it("should update user in transaction", async () => {
        const command = new UpdateUserCommand("1", { name: "New Name" });

        await handler.execute(command);

        expect(prisma.$transaction).toHaveBeenCalled();
    });
});
```

### Mocking CommandBus and QueryBus

```typescript
// test/mocks/cqrs.mock.ts
export const createMockCommandBus = () => ({
    execute: jest.fn(),
    register: jest.fn()
});

export const createMockQueryBus = () => ({
    execute: jest.fn(),
    register: jest.fn()
});

// Usage
describe("RegisterUserHandler", () => {
    let handler: RegisterUserHandler;
    let commandBus: ReturnType<typeof createMockCommandBus>;

    beforeEach(() => {
        commandBus = createMockCommandBus();
        handler = new RegisterUserHandler(commandBus as any);
    });

    it("should execute multiple commands", async () => {
        commandBus.execute
            .mockResolvedValueOnce({ id: "1" })
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined);

        const command = new RegisterUserCommand(
            "test@example.com",
            "Test",
            "password"
        );

        await handler.execute(command);

        expect(commandBus.execute).toHaveBeenCalledTimes(3);
    });
});
```

### Mocking EventBus

```typescript
export const createMockEventBus = () => ({
    publish: jest.fn(),
    publishAll: jest.fn()
});

describe("CreateUserHandler", () => {
    let handler: CreateUserHandler;
    let eventBus: ReturnType<typeof createMockEventBus>;

    beforeEach(() => {
        eventBus = createMockEventBus();
        handler = new CreateUserHandler(prisma, eventBus as any);
    });

    it("should publish UserCreatedEvent", async () => {
        const command = new CreateUserCommand("test@example.com", "Test");

        await handler.execute(command);

        expect(eventBus.publish).toHaveBeenCalledWith(
            expect.any(UserCreatedEvent)
        );
    });
});
```

## Test Data Builders

### User Builder

```typescript
// test/builders/user.builder.ts
export class UserBuilder {
    private user = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    withId(id: string): this {
        this.user.id = id;
        return this;
    }

    withEmail(email: string): this {
        this.user.email = email;
        return this;
    }

    withName(name: string): this {
        this.user.name = name;
        return this;
    }

    build() {
        return { ...this.user };
    }
}

// Usage
describe("GetUserByIdHandler", () => {
    it("should return user", async () => {
        const user = new UserBuilder()
            .withId("123")
            .withEmail("custom@example.com")
            .build();

        prismaService.user.findFirst.mockResolvedValue(user);

        const result = await handler.execute(new GetUserByIdQuery("123"));

        expect(result.user).toEqual(user);
    });
});
```

### Command Builder

```typescript
// test/builders/command.builder.ts
export class CreateUserCommandBuilder {
    private email = "test@example.com";
    private name = "Test User";

    withEmail(email: string): this {
        this.email = email;
        return this;
    }

    withName(name: string): this {
        this.name = name;
        return this;
    }

    build(): CreateUserCommand {
        return new CreateUserCommand(this.email, this.name);
    }
}

// Usage
it("should create user with custom data", async () => {
    const command = new CreateUserCommandBuilder()
        .withEmail("custom@example.com")
        .withName("Custom Name")
        .build();

    await handler.execute(command);

    expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
            email: "custom@example.com",
            name: "Custom Name"
        }
    });
});
```

## E2E Testing

### Full Flow E2E Test

```typescript
// test/e2e/user.e2e-spec.ts
describe("User E2E", () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = app.get<PrismaService>(PrismaService);
        await app.init();
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    beforeEach(async () => {
        // Clean database
        await prisma.user.deleteMany();
    });

    describe("POST /users", () => {
        it("should create user", async () => {
            const response = await request(app.getHttpServer())
                .post("/users")
                .send({
                    email: "test@example.com",
                    name: "Test User"
                })
                .expect(201);

            expect(response.body.id).toBeDefined();

            // Verify in database
            const user = await prisma.user.findUnique({
                where: { id: response.body.id }
            });
            expect(user).toBeDefined();
            expect(user.email).toBe("test@example.com");
        });
    });

    describe("GET /users/:id", () => {
        it("should get user by id", async () => {
            // Arrange - create user
            const user = await prisma.user.create({
                data: {
                    email: "test@example.com",
                    name: "Test User"
                }
            });

            // Act & Assert
            const response = await request(app.getHttpServer())
                .get(`/users/${user.id}`)
                .expect(200);

            expect(response.body.user.id).toBe(user.id);
            expect(response.body.user.email).toBe("test@example.com");
        });

        it("should return 400 when user not found", async () => {
            await request(app.getHttpServer())
                .get("/users/nonexistent")
                .expect(400);
        });
    });

    describe("PUT /users/:id", () => {
        it("should update user profile", async () => {
            // Arrange
            const user = await prisma.user.create({
                data: {
                    email: "test@example.com",
                    name: "Test User"
                }
            });

            const token = "valid-jwt-token"; // Generate valid token

            // Act
            await request(app.getHttpServer())
                .put(`/users/${user.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Updated Name" })
                .expect(201);

            // Assert
            const updated = await prisma.user.findUnique({
                where: { id: user.id }
            });
            expect(updated.name).toBe("Updated Name");
        });
    });
});
```

### Testing with Real Database (Docker)

```typescript
// test/e2e/setup.ts
import { execSync } from "child_process";

export const setupTestDatabase = async () => {
    // Start test database container
    execSync("docker-compose -f docker-compose.test.yml up -d");

    // Wait for database to be ready
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Run migrations
    execSync(
        "DATABASE_URL=postgresql://test:test@localhost:5433/test npx prisma migrate deploy"
    );
};

export const teardownTestDatabase = async () => {
    execSync("docker-compose -f docker-compose.test.yml down -v");
};

// jest.config.js
module.exports = {
    globalSetup: "./test/e2e/setup.ts",
    globalTeardown: "./test/e2e/teardown.ts"
};
```

## Test Coverage

### Coverage Configuration

```json
// jest.config.js
module.exports = {
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        "./src/modules/**/handlers/*.ts": {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        }
    },
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.spec.ts",
        "!src/**/*.module.ts",
        "!src/main.ts"
    ]
};
```

### Running Tests with Coverage

```bash
# Unit tests
npm test -- --coverage

# E2E tests
npm run test:e2e -- --coverage

# Specific handler
npm test -- create-user.handler.spec.ts --coverage
```

## Best Practices

### 1. Test Naming Convention

```typescript
// Good
describe("CreateUserHandler", () => {
    describe("execute", () => {
        it("should create user with valid data", () => {});
        it("should throw error when email is invalid", () => {});
        it("should throw error when user already exists", () => {});
    });
});

// Bad
describe("CreateUserHandler", () => {
    it("test1", () => {});
    it("works", () => {});
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it("should create user", async () => {
    // Arrange - Setup test data and mocks
    const command = new CreateUserCommand("test@example.com", "Test");
    prismaService.user.create.mockResolvedValue({ id: "1" });

    // Act - Execute the code under test
    const result = await handler.execute(command);

    // Assert - Verify the results
    expect(result.id).toBe("1");
});
```

### 3. Test Independence

```typescript
// Good - Each test is independent
describe("UserService", () => {
    beforeEach(() => {
        // Fresh setup for each test
        service = new UserService(commandBus, queryBus);
    });

    it("test 1", () => {});
    it("test 2", () => {});
});

// Bad - Tests depend on each other
let userId;
it("creates user", () => {
    userId = result.id; // Don't do this
});
it("gets user", () => {
    service.getUserById(userId); // Depends on previous test
});
```

### 4. Mock Only What You Need

```typescript
// Good - Mock only external dependencies
const prisma = {
    user: {
        create: jest.fn()
    }
} as any;

// Bad - Over-mocking
const prisma = {
    user: {
        /* all methods mocked */
    },
    post: {
        /* all methods mocked */
    },
    comment: {
        /* all methods mocked */
    }
} as any;
```
