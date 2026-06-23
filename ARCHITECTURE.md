# Angular E-Commerce Application

Modern, scalable Angular application following **Clean Architecture** principles.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                          # Singleton services, guards, interceptors
│   │   ├── services/                  # API services (HTTP, Auth, Products, Cart, etc.)
│   │   ├── interceptors/              # HTTP interceptors (Auth, Error handling)
│   │   ├── guards/                    # Route guards (authGuard, publicGuard)
│   │   └── index.ts                   # Core barrel export
│   │
│   ├── shared/                        # Reusable code across features
│   │   ├── models/                    # TypeScript interfaces & types
│   │   ├── components/                # Reusable components (Header, Footer)
│   │   ├── pipes/                     # Custom pipes (CurrencyFormat, Truncate)
│   │   ├── directives/                # Custom directives (future)
│   │   ├── utils/                     # Utility functions (formatters, helpers)
│   │   └── index.ts                   # Shared barrel export
│   │
│   ├── features/                      # Feature modules (lazy-loadable)
│   │   ├── auth/                      # Authentication (Login, Register)
│   │   ├── products/                  # Product listing & details
│   │   ├── posts/                     # Social feed
│   │   ├── todos/                     # Task management
│   │   ├── cart/                      # Shopping cart (future)
│   │   ├── dashboard/                 # Dashboard/Home
│   │   └── index.ts                   # Features barrel export
│   │
│   ├── app.component.ts               # Root component
│   ├── app.config.ts                  # Angular configuration
│   ├── app.routes.ts                  # Routing configuration
│   └── app.css                        # Global styles
│
├── environments/                      # Environment configurations
├── main.ts                            # Application entry point
└── styles.css                         # Tailwind CSS + global styles
```

## 🎯 Clean Architecture Principles

### **Core Layer** (`core/`)
- **Services**: Singleton services for API communication, authentication, and business logic
- **Interceptors**: HTTP interceptors for token management and error handling
- **Guards**: Route protection and authorization

### **Shared Layer** (`shared/`)
- **Models**: Reusable TypeScript interfaces and types
- **Components**: Reusable UI components (Header, Footer)
- **Pipes**: Custom Angular pipes (CurrencyFormat, Truncate)
- **Utils**: Pure utility functions (formatters, validators, helpers)

### **Features Layer** (`features/`)
- **Standalone components**: Each feature is self-contained
- **Feature isolation**: Features don't depend on each other
- **Scalability**: Easy to add new features without affecting others

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200
```

### Demo Credentials
- **Username**: `emilys`
- **Password**: `emilyspass`

Other available users: `atuny0`, `michaelw`, etc. (see DummyJSON docs)

## 📚 API Integration

### Services Structure
```
ProductService
├── getAllProducts()
├── getProductById()
├── searchProducts()
├── getCategories()
└── getProductsByCategory()

AuthService
├── login()
├── logout()
├── refreshToken()
└── getAccessToken()

CartService
├── getAllCarts()
├── getCartById()
├── getCartsByUserId()
├── addCart()
├── updateCart()
└── deleteCart()

PostService
├── getAllPosts()
├── getPostById()
├── searchPosts()
├── getPostsByUserId()
└── getCommentsByPostId()

TodoService
├── getAllTodos()
├── getTodoById()
├── getTodosByUserId()
└── getRandomTodos()
```

### HTTP Interceptors
- **AuthInterceptor**: Adds JWT token to requests, handles token refresh on 401
- **ErrorInterceptor**: Centralized error handling and logging

## 🛡️ Route Guards
- **authGuard**: Protects authenticated routes
- **publicGuard**: Redirects authenticated users away from login/register

## 🎨 UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Standalone Components**: Modern Angular approach

## 📦 Dependencies
```json
{
  "@angular/common": "^21.2.0",
  "@angular/compiler": "^21.2.0",
  "@angular/core": "^21.2.0",
  "@angular/forms": "^21.2.0",
  "@angular/platform-browser": "^21.2.0",
  "@angular/router": "^21.2.0",
  "rxjs": "~7.8.0",
  "tailwindcss": "^3.x.x"
}
```

## 🧪 Code Organization Best Practices

### Import Paths (using path aliases)
```typescript
// ✅ Good
import { AuthService } from '@core/services';
import { User } from '@shared/models';
import { CurrencyFormatPipe } from '@shared/pipes';
import { LoginComponent } from '@features/auth';

// ❌ Avoid
import { AuthService } from '../../../core/services/auth.service';
```

### Component Structure
```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `...`,
  styles: [`...`],
})
export class ExampleComponent implements OnInit {
  private service = inject(ServiceName);
  
  data: any;
  
  ngOnInit(): void {
    this.loadData();
  }
  
  private loadData(): void {
    // Implementation
  }
}
```

### Service Pattern
```typescript
@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  constructor(private httpClient: HttpClientService) {}
  
  getExample(): Observable<Example> {
    return this.httpClient.get<Example>('/endpoint');
  }
}
```

## 🔄 Data Flow
1. **Component** dispatches action → calls **Service**
2. **Service** makes HTTP request via **HttpClientService**
3. **AuthInterceptor** adds JWT token
4. **Response** returned to component
5. **ErrorInterceptor** catches errors
6. **Component** updates view

## 📝 Utility Functions
- `formatCurrency()`: Format numbers as USD currency
- `calculateDiscount()`: Calculate discounted price
- `truncateText()`: Truncate strings with ellipsis
- `debounce()`: Debounce function calls
- `isValidEmail()`: Email validation

## 🚀 Build & Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Testing
```bash
npm test
```

## 📖 Key Concepts

### Standalone Components
All components use Angular's standalone API (`standalone: true`), eliminating the need for NgModules.

### Dependency Injection
Uses Angular's modern `inject()` function instead of constructor injection:
```typescript
private service = inject(ServiceName);
```

### Signals (Future)
Ready for Angular Signal-based state management.

### RxJS
Observable-based data flow with proper subscription management.

## 🎓 Learning Resources
- [Angular Documentation](https://angular.dev)
- [DummyJSON API Docs](https://dummyjson.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [RxJS Guide](https://rxjs.dev)

## 📄 License
MIT
