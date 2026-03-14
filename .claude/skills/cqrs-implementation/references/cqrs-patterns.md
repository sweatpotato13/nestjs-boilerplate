# Advanced CQRS Patterns

## Table of Contents

1. [Saga Pattern](#saga-pattern)
2. [Event Sourcing Integration](#event-sourcing-integration)
3. [Complex Query Patterns](#complex-query-patterns)
4. [Command Composition](#command-composition)
5. [Optimistic Locking](#optimistic-locking)
6. [Read Model Projection](#read-model-projection)

## Saga Pattern

Use sagas for long-running transactions across multiple aggregates.

### Basic Saga

```typescript
// domain/sagas/user-registration.saga.ts
import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserCreatedEvent } from "../events/impl";
import { SendWelcomeEmailCommand } from "../commands/impl";

@Injectable()
export class UserRegistrationSaga {
    @Saga()
    userCreated = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            ofType(UserCreatedEvent),
            map(event => new SendWelcomeEmailCommand(event.userId, event.email))
        );
    };
}
```

### Multi-Step Saga with Compensation

```typescript
@Injectable()
export class OrderProcessingSaga {
    @Saga()
    orderCreated = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            ofType(OrderCreatedEvent),
            mergeMap(event => [
                new ReserveInventoryCommand(event.orderId, event.items),
                new ProcessPaymentCommand(event.orderId, event.amount)
            ])
        );
    };

    @Saga()
    paymentFailed = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            ofType(PaymentFailedEvent),
            map(event => new ReleaseInventoryCommand(event.orderId))
        );
    };
}
```

**Register in module:**

```typescript
@Module({
    imports: [CqrsModule],
    providers: [
        UserRegistrationSaga,
        OrderProcessingSaga,
        ...CommandHandlers,
        ...QueryHandlers
    ]
})
export class OrderModule {}
```

## Event Sourcing Integration

### Event Store Pattern

```typescript
// domain/events/impl/user-created.event.ts
export class UserCreatedEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly timestamp: Date
    ) {}
}
```

### Event Handler

```typescript
// domain/events/handlers/user-created.handler.ts
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../impl";

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
    async handle(event: UserCreatedEvent) {
        // Update read model
        // Send notifications
        // Log analytics
    }
}
```

### Publishing Events from Command Handler

```typescript
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        private readonly prisma: PrismaService,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: CreateUserCommand) {
        const user = await this.prisma.user.create({
            data: { email: command.email, name: command.name }
        });

        this.eventBus.publish(
            new UserCreatedEvent(user.id, user.email, new Date())
        );

        return { id: user.id };
    }
}
```

## Complex Query Patterns

### Pagination Query

```typescript
// domain/queries/impl/get-users-paginated.query.ts
export class GetUsersPaginatedQuery implements IQuery {
    constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly sortBy?: string,
        public readonly sortOrder?: "asc" | "desc"
    ) {}
}

// Handler
@QueryHandler(GetUsersPaginatedQuery)
export class GetUsersPaginatedHandler {
    async execute(query: GetUsersPaginatedQuery) {
        const { page, limit, sortBy = "createdAt", sortOrder = "desc" } = query;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder }
            }),
            this.prisma.user.count()
        ]);

        return {
            data: users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
```

### Filter Query with Dynamic Criteria

```typescript
export class SearchUsersQuery implements IQuery {
    constructor(
        public readonly filters: {
            email?: string;
            name?: string;
            status?: string;
            createdAfter?: Date;
            createdBefore?: Date;
        }
    ) {}
}

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler {
    async execute(query: SearchUsersQuery) {
        const where: any = {};

        if (query.filters.email) {
            where.email = { contains: query.filters.email };
        }

        if (query.filters.name) {
            where.name = { contains: query.filters.name };
        }

        if (query.filters.status) {
            where.status = query.filters.status;
        }

        if (query.filters.createdAfter || query.filters.createdBefore) {
            where.createdAt = {};
            if (query.filters.createdAfter) {
                where.createdAt.gte = query.filters.createdAfter;
            }
            if (query.filters.createdBefore) {
                where.createdAt.lte = query.filters.createdBefore;
            }
        }

        return await this.prisma.user.findMany({ where });
    }
}
```

### Aggregation Query

```typescript
export class GetUserStatisticsQuery implements IQuery {
    constructor(
        public readonly startDate: Date,
        public readonly endDate: Date
    ) {}
}

@QueryHandler(GetUserStatisticsQuery)
export class GetUserStatisticsHandler {
    async execute(query: GetUserStatisticsQuery) {
        const { startDate, endDate } = query;

        const [totalUsers, activeUsers, newUsers] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: {
                    lastLoginAt: { gte: startDate }
                }
            }),
            this.prisma.user.count({
                where: {
                    createdAt: { gte: startDate, lte: endDate }
                }
            })
        ]);

        return {
            totalUsers,
            activeUsers,
            newUsers,
            period: { startDate, endDate }
        };
    }
}
```

## Command Composition

### Composite Command

```typescript
// High-level command
export class RegisterUserCommand implements ICommand {
    constructor(
        public readonly email: string,
        public readonly name: string,
        public readonly password: string
    ) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus
    ) {}

    async execute(command: RegisterUserCommand) {
        // Step 1: Create user
        const createResult = await this.commandBus.execute(
            new CreateUserCommand(command.email, command.name)
        );

        // Step 2: Set password
        await this.commandBus.execute(
            new SetUserPasswordCommand(createResult.id, command.password)
        );

        // Step 3: Assign default role
        await this.commandBus.execute(
            new AssignRoleCommand(createResult.id, "user")
        );

        // Step 4: Send welcome email
        await this.commandBus.execute(
            new SendWelcomeEmailCommand(createResult.id, command.email)
        );

        return { userId: createResult.id };
    }
}
```

### Command with Rollback

```typescript
@CommandHandler(ProcessOrderCommand)
export class ProcessOrderHandler {
    async execute(command: ProcessOrderCommand) {
        let inventoryReserved = false;
        let paymentProcessed = false;

        try {
            // Reserve inventory
            await this.commandBus.execute(
                new ReserveInventoryCommand(command.items)
            );
            inventoryReserved = true;

            // Process payment
            await this.commandBus.execute(
                new ProcessPaymentCommand(command.amount)
            );
            paymentProcessed = true;

            // Create order
            return await this.commandBus.execute(
                new CreateOrderCommand(command)
            );
        } catch (error) {
            // Rollback
            if (paymentProcessed) {
                await this.commandBus.execute(
                    new RefundPaymentCommand(command.amount)
                );
            }
            if (inventoryReserved) {
                await this.commandBus.execute(
                    new ReleaseInventoryCommand(command.items)
                );
            }
            throw error;
        }
    }
}
```

## Optimistic Locking

### Version-Based Locking

```typescript
export class UpdateUserCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly data: any,
        public readonly version: number
    ) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler {
    async execute(command: UpdateUserCommand) {
        const { id, data, version } = command;

        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new BadRequestException("user not found");
        }

        if (user.version !== version) {
            throw new ConflictException(
                "user has been modified by another process"
            );
        }

        return await this.prisma.user.update({
            where: { id },
            data: {
                ...data,
                version: version + 1
            }
        });
    }
}
```

## Read Model Projection

### Materialized View Pattern

```typescript
// Separate read model
export class UserReadModel {
    id: string;
    email: string;
    name: string;
    postCount: number;
    lastPostDate: Date;
    followerCount: number;
}

// Query handler uses read model
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler {
    async execute(query: GetUserProfileQuery) {
        // Query optimized read model instead of joining multiple tables
        return await this.prisma.userReadModel.findUnique({
            where: { id: query.userId }
        });
    }
}

// Event handler updates read model
@EventsHandler(PostCreatedEvent)
export class PostCreatedHandler {
    async handle(event: PostCreatedEvent) {
        await this.prisma.userReadModel.update({
            where: { id: event.authorId },
            data: {
                postCount: { increment: 1 },
                lastPostDate: event.createdAt
            }
        });
    }
}
```

### CQRS with Separate Databases

```typescript
// Write model uses main database
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
    constructor(
        @Inject("WRITE_DB")
        private readonly writeDb: PrismaService
    ) {}

    async execute(command: CreateUserCommand) {
        return await this.writeDb.user.create({
            data: command
        });
    }
}

// Read model uses read replica
@QueryHandler(GetUserQuery)
export class GetUserHandler {
    constructor(
        @Inject("READ_DB")
        private readonly readDb: PrismaService
    ) {}

    async execute(query: GetUserQuery) {
        return await this.readDb.user.findUnique({
            where: { id: query.id }
        });
    }
}
```

## Performance Optimization

### Caching Query Results

```typescript
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler {
    constructor(
        private readonly prisma: PrismaService,
        @Inject("REDIS")
        private readonly redis: RedisService
    ) {}

    async execute(query: GetUserByIdQuery) {
        const cacheKey = `user:${query.id}`;

        // Check cache
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        // Query database
        const user = await this.prisma.user.findUnique({
            where: { id: query.id }
        });

        if (!user) {
            throw new BadRequestException("user not found");
        }

        // Cache result
        await this.redis.set(cacheKey, JSON.stringify(user), "EX", 3600);

        return user;
    }
}
```

### Cache Invalidation on Command

```typescript
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler {
    constructor(
        private readonly prisma: PrismaService,
        @Inject("REDIS")
        private readonly redis: RedisService
    ) {}

    async execute(command: UpdateUserCommand) {
        const result = await this.prisma.user.update({
            where: { id: command.id },
            data: command.data
        });

        // Invalidate cache
        await this.redis.del(`user:${command.id}`);

        return result;
    }
}
```

## Testing Advanced Patterns

### Testing Sagas

```typescript
describe("UserRegistrationSaga", () => {
    let saga: UserRegistrationSaga;

    beforeEach(() => {
        saga = new UserRegistrationSaga();
    });

    it("should send welcome email when user is created", done => {
        const event = new UserCreatedEvent("1", "test@example.com", new Date());
        const events$ = of(event);

        saga.userCreated(events$).subscribe(command => {
            expect(command).toBeInstanceOf(SendWelcomeEmailCommand);
            expect(command.userId).toBe("1");
            expect(command.email).toBe("test@example.com");
            done();
        });
    });
});
```

### Testing Event Handlers

```typescript
describe("UserCreatedHandler", () => {
    let handler: UserCreatedHandler;
    let eventBus: EventBus;

    beforeEach(() => {
        eventBus = new EventBus();
        handler = new UserCreatedHandler(eventBus);
    });

    it("should handle user created event", async () => {
        const event = new UserCreatedEvent("1", "test@example.com", new Date());
        const spy = jest.spyOn(eventBus, "publish");

        await handler.handle(event);

        expect(spy).toHaveBeenCalled();
    });
});
```

### Testing Command Composition

```typescript
describe("RegisterUserHandler", () => {
    let handler: RegisterUserHandler;
    let commandBus: CommandBus;

    beforeEach(() => {
        commandBus = {
            execute: jest.fn()
        } as any;
        handler = new RegisterUserHandler(commandBus);
    });

    it("should execute all sub-commands", async () => {
        const command = new RegisterUserCommand(
            "test@example.com",
            "Test",
            "password"
        );

        (commandBus.execute as jest.Mock)
            .mockResolvedValueOnce({ id: "1" })
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined);

        await handler.execute(command);

        expect(commandBus.execute).toHaveBeenCalledTimes(4);
        expect(commandBus.execute).toHaveBeenCalledWith(
            expect.any(CreateUserCommand)
        );
        expect(commandBus.execute).toHaveBeenCalledWith(
            expect.any(SetUserPasswordCommand)
        );
    });
});
```
