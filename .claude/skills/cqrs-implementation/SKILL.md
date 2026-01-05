---
name: cqrs-implementation
description: Use when implementing features using CQRS pattern in NestJS. Apply for all create, read, update, delete operations that need separation of commands (write) and queries (read). Required for all business logic implementation in this project.
---

# CQRS Implementation

## Overview

Implement all business logic using Command Query Responsibility Segregation (CQRS) pattern with @nestjs/cqrs.

**Core principle:** Commands change state. Queries return data. Never mix them.

## When to Use

**Always:**

- Creating new features
- Adding CRUD operations
- Implementing business logic
- Modifying data (write operations)
- Retrieving data (read operations)

**Pattern:**

- Write operations → Commands
- Read operations → Queries
- Controllers → Service → CommandBus/QueryBus → Handlers

## Architecture Layers

```
Controller (HTTP Layer)
    ↓
Service (Application Layer)
    ↓
CommandBus / QueryBus
    ↓
Handler (Domain Layer)
    ↓
Repository / Database
```

## Directory Structure

```
src/modules/{module-name}/
├── app/
│   ├── {module}.controller.ts
│   ├── {module}.controller.spec.ts
│   ├── {module}.service.ts
│   └── {module}.service.spec.ts
├── domain/
│   ├── commands/
│   │   ├── handlers/
│   │   │   ├── index.ts
│   │   │   ├── {action}.handler.ts
│   │   │   └── {action}.handler.spec.ts
│   │   └── impl/
│   │       ├── index.ts
│   │       └── {action}.command.ts
│   ├── queries/
│   │   ├── handlers/
│   │   │   ├── index.ts
│   │   │   ├── {action}.handler.ts
│   │   │   └── {action}.handler.spec.ts
│   │   └── impl/
│   │       ├── index.ts
│   │       └── {action}.query.ts
│   └── dtos/
│       ├── index.ts
│       ├── bodies/
│       │   └── {name}.body.dto.ts
│       └── responses/
│           └── {name}.response.dto.ts
├── infrastructures/
│   └── index.ts
└── {module}.module.ts
```

## Implementation Steps

### Step 1: Define Command or Query

**For write operations (Command):**

```typescript
// domain/commands/impl/create-user.command.ts
import { ICommand } from "@nestjs/cqrs";

export class CreateUserCommand implements ICommand {
    constructor(
        public readonly email: string,
        public readonly name: string
    ) {}
}
```

**For read operations (Query):**

```typescript
// domain/queries/impl/get-user-by-id.query.ts
import { IQuery } from "@nestjs/cqrs";

export class GetUserByIdQuery implements IQuery {
    constructor(public readonly id: string) {}
}
```

**Rules:**

- Commands: Use verb + noun (CreateUser, UpdateProfile, DeletePost)
- Queries: Use Get + noun + By + criteria (GetUserById, GetPostsByAuthor)
- Implement ICommand or IQuery interface
- Constructor parameters = all required data
- Readonly properties only
- No logic in command/query classes

### Step 2: Create Handler

**Command Handler:**

```typescript
// domain/commands/handlers/create-user.handler.ts
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { PrismaService } from "@src/shared/services";
import { CreateUserCommand } from "../impl";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(command: CreateUserCommand) {
        try {
            const { email, name } = command;

            const user = await this.prismaService.user.create({
                data: { email, name }
            });

            return { id: user.id, message: "User created" };
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
```

**Query Handler:**

```typescript
// domain/queries/handlers/get-user-by-id.handler.ts
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { logger } from "@src/config/modules/winston";
import { BadRequestException } from "@src/shared/models/error/http.error";
import { PrismaService } from "@src/shared/services";
import { GetUserResponseDto } from "../../dtos";
import { GetUserByIdQuery } from "../impl";

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
    constructor(
        @Inject("PrismaService")
        private readonly prismaService: PrismaService
    ) {}

    async execute(query: GetUserByIdQuery) {
        try {
            const { id } = query;

            const user = await this.prismaService.user.findFirst({
                where: { id }
            });

            if (!user) {
                throw new BadRequestException("user not found", {
                    context: "GetUserByIdQuery"
                });
            }

            return GetUserResponseDto.of({ result: "OK", user });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
```

**Handler Rules:**

- One handler per command/query
- Use @CommandHandler or @QueryHandler decorator
- Implement ICommandHandler or IQueryHandler
- Inject dependencies via constructor
- All business logic goes here
- Wrap in try-catch with logging
- Return DTOs, not raw entities
- Use transactions for multi-step operations

### Step 3: Export Handlers

```typescript
// domain/commands/handlers/index.ts
import { CreateUserHandler } from "./create-user.handler";
import { UpdateUserHandler } from "./update-user.handler";

export const CommandHandlers = [CreateUserHandler, UpdateUserHandler];
export * from "./create-user.handler";
export * from "./update-user.handler";
```

```typescript
// domain/queries/handlers/index.ts
import { GetUserByIdHandler } from "./get-user-by-id.handler";
import { GetUserByEmailHandler } from "./get-user-by-email.handler";

export const QueryHandlers = [GetUserByIdHandler, GetUserByEmailHandler];
export * from "./get-user-by-id.handler";
export * from "./get-user-by-email.handler";
```

### Step 4: Create Service

```typescript
// app/{module}.service.ts
import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../domain/commands/impl";
import { GetUserByIdQuery } from "../domain/queries/impl";

@Injectable()
export class UserService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    async createUser(email: string, name: string) {
        return await this.commandBus.execute(
            new CreateUserCommand(email, name)
        );
    }

    async getUserById(id: string) {
        return await this.queryBus.execute(new GetUserByIdQuery(id));
    }
}
```

**Service Rules:**

- Inject CommandBus and QueryBus
- Create command/query instances
- Execute via appropriate bus
- No business logic here
- Thin layer between controller and handlers

### Step 5: Use in Controller

```typescript
// app/{module}.controller.ts
import { Controller, Get, Post, Body, Param, Inject } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(
        @Inject("UserService")
        private readonly service: UserService
    ) {}

    /**
     * Create new user.
     * @param body - User creation data
     * @returns Created user information
     * @tag user
     */
    @Post()
    async createUser(@Body() body: CreateUserDto) {
        return await this.service.createUser(body.email, body.name);
    }

    /**
     * Get user by ID.
     * @param id - User ID
     * @returns User information
     * @tag user
     */
    @Get(":id")
    async getUserById(@Param("id") id: string) {
        return await this.service.getUserById(id);
    }
}
```

### Step 6: Register in Module

```typescript
// {module}.module.ts
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaService } from "@src/shared/services";
import { UserController } from "./app/user.controller";
import { UserService } from "./app/user.service";
import { CommandHandlers } from "./domain/commands/handlers";
import { QueryHandlers } from "./domain/queries/handlers";

@Module({
    imports: [CqrsModule],
    providers: [
        { provide: "PrismaService", useClass: PrismaService },
        { provide: "UserService", useClass: UserService },
        ...CommandHandlers,
        ...QueryHandlers
    ],
    controllers: [UserController]
})
export class UserModule {}
```

**Module Rules:**

- Import CqrsModule
- Spread CommandHandlers and QueryHandlers arrays
- Use dependency injection tokens
- Register all handlers as providers

## Command vs Query Decision

| Operation       | Type    | Example               |
| --------------- | ------- | --------------------- |
| Create          | Command | CreateUserCommand     |
| Update          | Command | UpdateProfileCommand  |
| Delete          | Command | DeletePostCommand     |
| Retrieve single | Query   | GetUserByIdQuery      |
| Retrieve list   | Query   | GetPostsByAuthorQuery |
| Search          | Query   | SearchUsersQuery      |
| Count           | Query   | CountActiveUsersQuery |

**Rule:** If it changes state → Command. If it reads state → Query.

## Transaction Handling

For operations requiring multiple database operations:

```typescript
@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler {
    async execute(command: UpdateUserProfileCommand) {
        try {
            return await this.prismaService.$transaction(async tx => {
                const { id, profile } = command;

                const user = await tx.user.findUnique({ where: { id } });
                if (!user) {
                    throw new BadRequestException("user not found");
                }

                await tx.user.update({
                    where: { id },
                    data: { name: profile.name }
                });

                return { message: "Profile updated" };
            });
        } catch (error: any) {
            logger.error(error.message);
            throw error;
        }
    }
}
```

## Error Handling

**Standard pattern:**

```typescript
async execute(command: SomeCommand) {
    try {
        // Business logic
        return result;
    } catch (error: any) {
        logger.error(error.message);
        throw error;
    }
}
```

**Custom errors:**

```typescript
import { BadRequestException } from "@src/shared/models/error/http.error";

throw new BadRequestException("user not found", {
    context: "GetUserByIdQuery"
});
```

## Testing

**Command Handler Test:**

```typescript
describe("CreateUserHandler", () => {
    let handler: CreateUserHandler;
    let prismaService: PrismaService;

    beforeEach(() => {
        prismaService = new PrismaService();
        handler = new CreateUserHandler(prismaService);
    });

    it("should create user", async () => {
        const command = new CreateUserCommand("test@example.com", "Test User");
        jest.spyOn(prismaService.user, "create").mockResolvedValue({
            id: "1",
            email: "test@example.com",
            name: "Test User"
        });

        const result = await handler.execute(command);

        expect(result.id).toBe("1");
        expect(prismaService.user.create).toHaveBeenCalledWith({
            data: { email: "test@example.com", name: "Test User" }
        });
    });
});
```

## Common Patterns

### Pattern 1: Validation in Handler

```typescript
async execute(command: UpdateUserCommand) {
    const { id, userId, data } = command;

    if (id !== userId) {
        throw new BadRequestException("user id not matches");
    }

    // Continue with business logic
}
```

### Pattern 2: Multiple Queries in Handler

```typescript
async execute(query: GetUserWithPostsQuery) {
    const { userId } = query;

    const [user, posts] = await Promise.all([
        this.prismaService.user.findUnique({ where: { id: userId } }),
        this.prismaService.post.findMany({ where: { authorId: userId } })
    ]);

    return { user, posts };
}
```

### Pattern 3: Command Chaining

```typescript
// In service
async registerUser(email: string, name: string) {
    const createResult = await this.commandBus.execute(
        new CreateUserCommand(email, name)
    );

    await this.commandBus.execute(
        new SendWelcomeEmailCommand(createResult.id)
    );

    return createResult;
}
```

## Anti-Patterns to Avoid

❌ **Direct repository access in controller:**

```typescript
// BAD
@Controller("users")
export class UserController {
    constructor(private prisma: PrismaService) {}

    @Get(":id")
    async getUser(@Param("id") id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
```

✅ **Use query handler:**

```typescript
// GOOD
@Get(":id")
async getUser(@Param("id") id: string) {
    return this.service.getUserById(id);
}
```

❌ **Business logic in service:**

```typescript
// BAD
async updateUser(id: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Not found");
    return this.commandBus.execute(new UpdateUserCommand(id, data));
}
```

✅ **Business logic in handler:**

```typescript
// GOOD - Service just dispatches
async updateUser(id: string, data: any) {
    return this.commandBus.execute(new UpdateUserCommand(id, data));
}

// Handler contains validation
async execute(command: UpdateUserCommand) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException("user not found");
    // Update logic
}
```

❌ **Mixing command and query:**

```typescript
// BAD
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
    async execute(command: CreateUserCommand) {
        const existing = await this.prisma.user.findUnique({
            where: { email: command.email }
        });
        // This is a query inside a command - acceptable for validation
        // But don't return query results as the main response
    }
}
```

## Checklist

Before marking CQRS implementation complete:

- [ ] Command/Query implements ICommand/IQuery
- [ ] Handler decorated with @CommandHandler/@QueryHandler
- [ ] Handler implements ICommandHandler/IQueryHandler
- [ ] Handler exported in index.ts
- [ ] Handler registered in module providers
- [ ] Service uses CommandBus/QueryBus
- [ ] Controller calls service methods
- [ ] No business logic in controller or service
- [ ] All business logic in handlers
- [ ] Error handling with try-catch and logging
- [ ] Tests written for handlers (TDD)
- [ ] Transactions used for multi-step operations
- [ ] DTOs used for responses

## Quick Reference

**Create new feature:**

1. Write test for handler (TDD)
2. Define command/query in `impl/`
3. Create handler in `handlers/`
4. Export in `handlers/index.ts`
5. Add method to service
6. Add endpoint to controller
7. Register handler in module
8. Verify tests pass

**File naming:**

- Command: `{action}.command.ts` (create-user.command.ts)
- Query: `{action}.query.ts` (get-user-by-id.query.ts)
- Handler: `{action}.handler.ts` (create-user.handler.ts)
- Test: `{action}.handler.spec.ts` (create-user.handler.spec.ts)

## Additional Resources

For detailed examples and patterns, see:

- `references/cqrs-patterns.md` - Advanced CQRS patterns and examples
- `references/testing-strategies.md` - Testing strategies for CQRS
