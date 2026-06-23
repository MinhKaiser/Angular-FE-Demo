# Contributing Guide

## Getting Started

### 1. Clone Repository
```bash
git clone <repository-url>
cd angular-learning
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Update .env with your local values (default values are already set)
cat .env
```

### 4. Start Development Server
```bash
npm start
```

Navigate to `http://localhost:4200/`

### Demo Credentials
- **Username**: `emilys`
- **Password**: `emilyspass`

## Development Workflow

### File Structure
Follow the established clean architecture:

```
src/app/
├── core/              # Services, guards, interceptors (singleton)
├── shared/            # Reusable code (models, components, pipes, utils)
├── features/          # Feature modules (auth, products, posts, etc.)
└── app.component.ts   # Root component
```

### Creating New Features

1. **Create feature folder**
   ```bash
   mkdir src/app/features/my-feature
   ```

2. **Create component (standalone)**
   ```typescript
   @Component({
     selector: 'app-my-feature',
     standalone: true,
     imports: [CommonModule],
     template: `...`,
   })
   export class MyFeatureComponent {}
   ```

3. **Add to routing** (`app.routes.ts`)
   ```typescript
   {
     path: 'my-feature',
     component: MyFeatureComponent,
     canActivate: [authGuard],
   }
   ```

### Creating New Services

1. **Create service in core/services**
   ```typescript
   @Injectable({
     providedIn: 'root',
   })
   export class MyService {
     constructor(private http: HttpClientService) {}
     
     getData(): Observable<Data> {
       return this.http.get<Data>('/endpoint');
     }
   }
   ```

2. **Export from index.ts**
   ```typescript
   // src/app/core/services/index.ts
   export * from './my.service';
   ```

## Code Standards

### Import Paths
Use path aliases for clean imports:

```typescript
// ✅ Good
import { AuthService } from '@core/services';
import { User } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';

// ❌ Bad
import { AuthService } from '../../../core/services/auth.service';
```

### Component Structure
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`,
})
export class ExampleComponent implements OnInit {
  // 1. Injected dependencies
  private service = inject(ServiceName);
  
  // 2. Properties
  data: any;
  isLoading = false;
  
  // 3. Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  // 4. Public methods
  onSubmit(): void {}
  
  // 5. Private methods
  private loadData(): void {}
}
```

### Naming Conventions
```typescript
// Components
MyFeatureComponent       // PascalCase with "Component" suffix
my-feature.component.ts  // kebab-case filename

// Services
MyFeatureService         // PascalCase with "Service" suffix
my-feature.service.ts    // kebab-case filename

// Variables & Methods
myVariable               // camelCase
myMethod()              // camelCase
MY_CONSTANT             // UPPER_SNAKE_CASE

// Files
my-feature.model.ts     // kebab-case
my-feature.pipe.ts      // kebab-case
my-feature.guard.ts     // kebab-case
```

## Testing

### Run Tests
```bash
npm test
```

### Test File Location
```
src/app/features/my-feature/
├── my-feature.component.ts
└── my-feature.component.spec.ts  # Test file
```

## Linting & Formatting

### Check Code Quality
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Git Workflow

### Branch Naming
```bash
feature/user-authentication
bugfix/login-token-refresh
refactor/service-cleanup
docs/api-documentation
```

### Commit Messages
Follow conventional commits:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: token refresh on 401"
git commit -m "refactor: simplify cart service"
git commit -m "docs: update API guide"
```

### Before Pushing
```bash
# 1. Run tests
npm test

# 2. Check linting
npm run lint

# 3. Format code
npm run format

# 4. Check git status
git status
```

## Building for Production

### Build Output
```bash
npm run build
```

Output: `dist/angular-learning/browser/`

### Build with Environment
```bash
# Development build
npm run build

# Production build (optimized)
npm run build -- --configuration production
```

## Security

⚠️ **Important Security Rules:**

1. **Never commit `.env` files**
   - Only `.env.example` should be in git
   - Use `.env` for local development only

2. **No secrets in code**
   - No API keys, passwords, or tokens in source
   - Use environment variables instead

3. **Check dependencies**
   ```bash
   npm audit
   npm audit fix
   ```

4. **HTTPS in production**
   - Always use HTTPS for API calls
   - Enable secure cookies

See [SECURITY.md](./SECURITY.md) for detailed guidelines.

## Troubleshooting

### Port Already in Use
```bash
# Use different port
ng serve --port 4300

# Or kill process on 4200
lsof -ti:4200 | xargs kill -9
```

### Clear Cache
```bash
rm -rf .angular/cache
rm -rf node_modules
npm install
```

### Git Issues
```bash
# Hard reset
git reset --hard HEAD

# Clean untracked files
git clean -fd
```

## Questions?

- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure
- Review [SECURITY.md](./SECURITY.md) for security practices
- See [Angular Docs](https://angular.dev) for framework questions

## Code Review Checklist

Before submitting PR, verify:

- [ ] Code follows naming conventions
- [ ] Uses clean architecture patterns
- [ ] Proper error handling
- [ ] No console.log statements (except dev)
- [ ] TypeScript strict mode passes
- [ ] Tests added/updated
- [ ] No sensitive data committed
- [ ] Dependencies updated if needed
- [ ] Commit messages follow conventions
