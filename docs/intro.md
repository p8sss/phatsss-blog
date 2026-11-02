---
sidebar_position: 1
title: Coding Standards
---

# Coding Standards
**Comprehensive Coding Standards for JavaScript, TypeScript, React, Next.js, Node.js, and NestJS**

## General JavaScript & TypeScript Standards

### TypeScript Configuration
- Enable strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Type Safety
- Avoid `any` type; use `unknown` with proper type narrowing
- Use generics for reusable components and functions
- Implement proper type guards for runtime type checking
- Use discriminated unions for complex state management

```typescript
// Good example
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Avoid
function processData(data: any) {
  // ...
}

// Prefer
function processData<T>(data: T): ProcessedResult<T> {
  // ...
}
```

### Modern JavaScript Features
- Use ES6+ features (destructuring, spread, optional chaining, etc.)
- Prefer `const` over `let`, avoid `var`
- Use async/await over promise chains for better readability
- Implement proper error handling with try/catch

```typescript
// Good example
const { user, preferences } = await getUserData();
const fullName = user?.profile?.name ?? 'Anonymous';

// Avoid
let name = 'Anonymous';
if (user && user.profile && user.profile.name) {
  name = user.profile.name;
}
```

### Code Organization
- Use named exports over default exports
- Group related functionality in modules
- Avoid circular dependencies
- Keep files focused and concise (< 400 lines)

```typescript
// Good: named exports keep modules focused and refactor-friendly
export interface UserProfile {
  id: string;
  name: string;
}

export const formatUserName = (user: UserProfile): string =>
  user.name.trim();

// Avoid: default exports mixed with unrelated helpers
export default class UserModule {
  formatName() {}
  sendEmail() {}
  saveToDatabase() {}
}
```

## React & Next.js Standards

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript typing for props
- Keep components focused and reusable
- Use custom hooks for complex logic

```typescript
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  isLoading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  isLoading = false
}) => {
  if (isLoading) {
    return <UserCardSkeleton />;
  }

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user)}>
          Edit
        </button>
      )}
    </div>
  );
};
```

### State Management
- Use useState for local component state
- Use useContext + useReducer for moderate global state
- Consider Zustand or Redux Toolkit for complex applications
- Implement proper state initialization and cleanup

```typescript
// Custom hook example
const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, loading, fetchUsers };
};
```

### Next.js Specific Guidelines
- Use App Router for new projects
- Implement proper page metadata and SEO
- Use Next.js Image component for optimized images
- Implement API routes with proper error handling

```typescript
// API route example
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Performance Optimization
- Implement React.memo for expensive components
- Use useCallback and useMemo appropriately
- Code splitting with React.lazy and dynamic imports
- Implement proper loading states

```typescript
// Dynamic import example
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { 
    loading: () => <SkeletonLoader />,
    ssr: false 
  }
);
```

## Node.js Standards

### Project Structure
```
src/
├── controllers/    # Route handlers
├── services/       # Business logic
├── repositories/   # Data access
├── models/         # Data models
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── config/         # Configuration
```

### Error Handling
- Use async error handling middleware
- Implement custom error classes
- Provide meaningful error messages
- Log errors appropriately

```typescript
// Custom error class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling middleware
export const errorHandler: ErrorRequestHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details
    });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
};
```

### API Design
- Follow RESTful principles
- Use consistent naming conventions
- Implement proper status codes
- Version your APIs

```typescript
import { Router } from 'express';

// /api/v1/users — versioned, RESTful route handlers
const usersRouter = Router();

usersRouter.get('/', listUsers); // GET    /api/v1/users
usersRouter.post('/', createUser); // POST   /api/v1/users
usersRouter.get('/:id', getUserById); // GET    /api/v1/users/:id
usersRouter.put('/:id', updateUser); // PUT    /api/v1/users/:id
usersRouter.delete('/:id', deleteUser); // DELETE /api/v1/users/:id
```

## NestJS Standards

### Project Structure
Follow the modular architecture pattern:
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   └── products/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
└── shared/
    └── services/
```

### Dependency Injection
- Use constructor injection
- Follow the single responsibility principle
- Implement proper module organization

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }
}
```

### Validation
- Use class-validator with DTOs
- Implement custom validation pipes
- Validate input at the boundary

```typescript
export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;
}
```

## Testing Standards

### Test Structure
- Follow AAA pattern (Arrange, Act, Assert)
- Write meaningful test descriptions
- Mock external dependencies
- Test edge cases and error conditions

```typescript
describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const savedUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersRepository.create.mockReturnValue(savedUser);
      usersRepository.save.mockResolvedValue(savedUser);

      // Act
      const result = await usersService.create(createUserDto);

      // Assert
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(usersRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(savedUser);
    });
  });
});
```

### Test Coverage
- Aim for 80%+ test coverage
- Focus on business logic, not implementation details
- Include integration tests for critical flows
- Use snapshot testing sparingly

```typescript
// vitest.config.ts — enforce an 80% coverage gate
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

## Security Standards

### Authentication & Authorization
- Implement proper JWT handling
- Use secure password hashing (bcrypt, Argon2)
- Implement rate limiting
- Use CSRF protection

```typescript
// Password hashing example
const saltRounds = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### Input Validation
- Validate all incoming data
- Sanitize user input
- Use parameterized queries to prevent SQL injection
- Implement proper CORS configuration

```typescript
// Validation pipe configuration in NestJS
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  })
);
```

## Performance Standards

### Database Optimization
- Use proper indexing
- Implement pagination for large datasets
- Use efficient queries with proper projections
- Implement caching where appropriate

```typescript
// Efficient query example
async findUsersWithPagination(
  skip: number,
  take: number
): Promise<{ users: User[]; total: number }> {
  const [users, total] = await this.usersRepository.findAndCount({
    select: ['id', 'email', 'firstName', 'lastName'],
    skip,
    take,
    order: { createdAt: 'DESC' },
  });

  return { users, total };
}
```

### Memory Management
- Avoid memory leaks with proper cleanup
- Use streaming for large data processing
- Implement connection pooling for databases

```typescript
import { createReadStream } from 'node:fs';

// Stream large files instead of buffering them entirely in memory
export const downloadReport = (filePath: string, res: Response): void => {
  res.setHeader('Content-Type', 'application/pdf');
  createReadStream(filePath).pipe(res); // chunks flow to the client, memory stays low
};
```

## Documentation Standards

### Code Documentation
- Use JSDoc for public APIs
- Document complex algorithms
- Include examples for reusable components

```typescript
/**
 * Calculates the distance between two points using the Haversine formula
 * @param lat1 - Latitude of the first point in degrees
 * @param lon1 - Longitude of the first point in degrees
 * @param lat2 - Latitude of the second point in degrees
 * @param lon2 - Longitude of the second point in degrees
 * @returns Distance between the points in kilometers
 * @example
 * const distance = calculateDistance(52.5200, 13.4050, 48.8566, 2.3522);
 * console.log(distance); // ≈ 878.5
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Implementation
}
```

### API Documentation
- Use OpenAPI/Swagger for REST APIs
- Keep documentation updated with code changes
- Include examples for all endpoints

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@ApiOperation({ summary: 'Create a new user' })
@ApiResponse({ status: 201, description: 'User created successfully' })
@ApiResponse({ status: 400, description: 'Invalid input' })
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

## Tooling & Configuration

### ESLint Configuration
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

### Git Hooks
- Use Husky for git hooks
- Run linting and tests before commits
- Validate commit messages

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm test -- --passWithNoTests",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Conclusion

These coding standards provide a comprehensive guide for developing maintainable, secure, and performant applications across the JavaScript/TypeScript ecosystem. Teams should regularly review and update these standards to incorporate new best practices and technologies.

Remember that standards are guidelines, not rigid rules. Use judgment and adapt these standards to your specific project needs while maintaining consistency across your codebase.