---
sidebar_position: 2
title: NestJS Project Structure
---

# NestJS Authentication & RBAC API
[**Nest-App-TS-Structure on Github**](https://github.com/phatsss/nest-app-ts-structure.git) - A secure, production-ready NestJS API with JWT authentication, role-based access control (RBAC), and OAuth integration.


## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework for building efficient and scalable server-side applications
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Powerful, open-source object-relational database system
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
- **Authentication**: 
  - JWT (JSON Web Tokens) with access/refresh token flow
  - OAuth 2.0 providers (Google, Facebook, TikTok)
  - Argon2 for secure password hashing
- **Authorization**: Custom RBAC (Role-Based Access Control) system
- **Validation**: class-validator and class-transformer
- **Configuration**: @nestjs/config for environment variables
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker and Docker Compose

## Features

- 🔐 **Secure Authentication**
  - JWT-based authentication with access and refresh tokens
  - Refresh token rotation for enhanced security
  - HTTP-only cookies for refresh tokens
  - Password hashing with Argon2
  - OAuth 2.0 integration (Google, Facebook, TikTok)

- 🛡️ **Advanced Authorization**
  - Role-based access control (RBAC)
  - Permission-based access control
  - Hierarchical roles with permission inheritance
  - Decorators for route protection (@Roles, @Permissions)

- 🏗️ **Robust Architecture**
  - Clean, modular code structure
  - Separation of concerns
  - Repository pattern with Prisma
  - DTO validation and transformation
  - Global exception handling
  - Standardized API responses

- 🐳 **Containerization**
  - Docker and Docker Compose setup
  - Multi-stage builds for optimized images
  - Volume persistence for database
  - Environment variable management

## Project Structure

```
├── prisma/                  # Prisma schema and migrations
├── src/
│   ├── auth/                # Authentication module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── guards/          # Authentication guards
│   │   ├── strategies/      # Passport strategies
│   │   ├── types/           # Type definitions
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── common/              # Shared code
│   │   ├── constants.ts     # Constants and enums
│   │   ├── decorators/      # Custom decorators
│   │   ├── dto/             # Shared DTOs
│   │   ├── guards/          # Shared guards
│   │   ├── interceptors/    # Response transformers
│   │   └── types/           # Shared types
│   ├── prisma/              # Prisma module
│   ├── roles/               # Roles and permissions module
│   ├── users/               # Users module
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application entry point
├── .dockerignore            # Docker ignore file
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── docker-compose.yml       # Docker Compose configuration
├── Dockerfile               # Docker build instructions
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Node.js dependencies
├── README.md                # Project documentation
├── tsconfig.json            # TypeScript configuration
└── yarn.lock                # Yarn lock file
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Yarn or npm
- PostgreSQL (or Docker for containerized setup)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd nest-app
```

2. Install dependencies

```bash
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Generate Prisma client

```bash
yarn prisma:generate
```

5. Run database migrations

```bash
yarn prisma:migrate
```

### Running the Application

#### Development mode

```bash
yarn start:dev
```

#### Production mode

```bash
yarn build
yarn start:prod
```

### Using Docker

```bash
# Build and start containers
docker-compose up -d

# Run migrations
docker-compose exec api yarn prisma:migrate

# View logs
docker-compose logs -f api

# Stop containers
docker-compose down
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login with email/phone and password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate refresh token)
- `GET /auth/profile` - Get current user profile

### OAuth

- `GET /auth/google` - Initiate Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - Initiate Facebook OAuth flow
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `GET /auth/tiktok` - Initiate TikTok OAuth flow
- `GET /auth/tiktok/callback` - TikTok OAuth callback

### Users

- `GET /users` - List all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user (admin only)
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Roles

- `GET /roles` - List all roles
- `GET /roles/:id` - Get role by ID
- `POST /roles` - Create a new role
- `PATCH /roles/:id` - Update a role
- `DELETE /roles/:id` - Delete a role
- `POST /roles/:id/permissions` - Assign permissions to a role
- `DELETE /roles/:id/permissions/:permissionId` - Remove a permission from a role

### Example Controller

```typescript
// src/auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto, RefreshTokenDto } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }
}
```

### Route Protection Example

```typescript
// Protect a route with RBAC decorators + guards
@Roles('admin')
@Permissions('users:delete')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Delete('users/:id')
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

### Standardized Responses

```typescript
// src/common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| `PORT` | Application port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `JWT_ACCESS_SECRET` | Secret for JWT access tokens | - |
| `JWT_REFRESH_SECRET` | Secret for JWT refresh tokens | - |
| `JWT_ACCESS_TTL` | Access token lifetime | `15m` |
| `JWT_REFRESH_TTL` | Refresh token lifetime | `7d` |
| `ENABLE_GOOGLE_OAUTH` | Enable Google OAuth | `false` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | - |
| `ENABLE_FACEBOOK_OAUTH` | Enable Facebook OAuth | `false` |
| `FACEBOOK_APP_ID` | Facebook OAuth app ID | - |
| `FACEBOOK_APP_SECRET` | Facebook OAuth app secret | - |
| `FACEBOOK_CALLBACK_URL` | Facebook OAuth callback URL | - |
| `ENABLE_TIKTOK_OAUTH` | Enable TikTok OAuth | `false` |
| `TIKTOK_CLIENT_KEY` | TikTok OAuth client key | - |
| `TIKTOK_CLIENT_SECRET` | TikTok OAuth client secret | - |
| `TIKTOK_CALLBACK_URL` | TikTok OAuth callback URL | - |

```bash
# .env.example
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/nest_app

JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

ENABLE_GOOGLE_OAUTH=false
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Security Best Practices

- **Password Storage**: Passwords are hashed using Argon2, a secure password-hashing function
- **JWT Security**: Short-lived access tokens with longer-lived refresh tokens
- **Cookie Security**: HTTP-only, secure cookies for refresh tokens
- **Input Validation**: All inputs are validated using class-validator
- **CORS Protection**: Configured CORS for API security
- **Rate Limiting**: API rate limiting to prevent abuse
- **Environment Variables**: Sensitive information stored in environment variables
- **Error Handling**: Custom error handling to prevent information leakage

```typescript
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

// Argon2 password hashing (memory-hard, resistant to GPU attacks)
const hash = await argon2.hash(password, { type: argon2.argon2id });
const isValid = await argon2.verify(hash, attempt);

// Short-lived access token signed with the JwtService
const accessToken = await this.jwtService.signAsync(
  { sub: user.id, email: user.email },
  {
    secret: this.config.get('JWT_ACCESS_SECRET'),
    expiresIn: this.config.get('JWT_ACCESS_TTL'), // e.g. "15m"
  },
);
```

## Performance Optimizations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Efficient Prisma queries with proper selection and filtering
- **Pagination**: All list endpoints support pagination
- **Caching**: Response caching for frequently accessed data
- **Docker Optimization**: Multi-stage builds for smaller images

```typescript
// Paginated, projected Prisma query — select only the columns you need
const [users, total] = await this.prisma.$transaction([
  this.prisma.user.findMany({
    select: { id: true, email: true, createdAt: true },
    where: { isActive: true },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  }),
  this.prisma.user.count({ where: { isActive: true } }),
]);
```

