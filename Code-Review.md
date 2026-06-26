# Code Review - Angular-FE-Demo

---

## 📊 Summary of Rule Compliance

| Rule Category            | Specific Rule                                      |     Status      | Findings / Files                                                                  |
| :----------------------- | :------------------------------------------------- | :-------------: | :-------------------------------------------------------------------------------- |
| **Angular Decorators**   | Do NOT set `standalone: true` (default in v20+)    | ❌ **Violated** | Redundant declaration in all components.                                          |
| **Templates & Flow**     | Use modern control flow (`@if`, `@for`, `@switch`) | ❌ **Violated** | Multi-file usage of legacy `*ngIf` and `*ngFor` directives.                       |
| **State Management**     | Derived State: Always use `computed()`             | ❌ **Violated** | `DashboardStatCardComponent` uses custom class method instead of `computed()`.    |
| **Routing & Setup**      | Path Aliasing: Avoid relative paths cross folders  | ❌ **Violated** | Core guards/interceptors import cross folder using `../` instead of `@core`.      |
| **Dependency Injection** | Always use the `inject()` function                 |   **Passed**    | Unified use of `inject()` instead of constructor injection.                       |
| **Reactivity**           | Use Angular Signals for state management           |   **Passed**    | State is managed using signals, custom computed properties, and NgRx SignalStore. |
| **Component Rules**      | Use signal-based `input()` and `output()`          |   **Passed**    | Proper utilization of Signal Inputs/Outputs without old decorators.               |
| **Templates & Flow**     | Do NOT use `ngClass` / `ngStyle`                   |   **Passed**    | Native binding style `[class]` is used properly.                                  |

---

## 🔍 Detailed Review & Actionable Refactorings

### 1. Angular Decorator Rule: Redundant `standalone: true`

> [!IMPORTANT]
> **Rule Reference (angular-rules.md):**
> _“Do NOT set `standalone: true` inside Angular decorators. This is the default behavior in Angular v20+.”_

- **Current State:** Components contain `standalone: true` inside `@Component` metadata.
- **Affected Files:**
  - `src/app/features/products/product-detail.component.ts` (Line 11)
  - `src/app/features/products/products-list.component.ts` (Line 16)
  - `src/app/features/todos/todos-list.component.ts` (Line 16)
  - `src/app/features/dashboard/dashboard.component.ts` (Line 21)
  - `src/app/shared/components/header.component.ts` (Line 11)
  - `src/app/features/todos/components/todo-form.component.ts` (Line 9)
  - `src/app/features/dashboard/components/dashboard-stat-card.component.ts` (Line 8)
- **Refactoring Solution:** Remove the line `standalone: true,` from the `@Component` decorators since the app runs on Angular 21 where it is default.

---

### 2. Templates & Control Flow: Legacy Structural Directives (`*ngIf`, `*ngFor`)

> [!IMPORTANT]
> **Rule Reference (angular-rules.md):**
> *“Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.”\*

- **Current State:** Active usage of old directive styles inside inline templates and HTML files.
- **Affected Files:**
  - `src/app/features/products/product-detail.component.ts` (Lines 20, 27, 33)
  - `src/app/features/products/products-list.component.ts` (Lines 50, 57, 62, 64, 70)
  - `src/app/features/todos/todos-list.component.ts` (Lines 45, 52, 57, 59, 68)
  - `src/app/features/dashboard/dashboard.component.html` (Lines 24, 37, 92, 122, 221, 224)
  - `src/app/shared/components/header.component.ts` (Lines 37, 53)
- **Refactoring Solution:**
  - Replace `*ngIf="condition"` with `@if (condition) { ... }`.
  - Replace `*ngFor="let item of list; trackBy: trackByFn"` with `@for (item of list; track item.id) { ... }`.

_Before & After in `products-list.component.ts`:_

```diff
- <div *ngIf="!store.isLoading() && store.products().length > 0" class="products-grid">
-   <app-product-card
-     *ngFor="let product of store.products(); trackBy: trackByProductId"
-     [product]="product"
-   />
- </div>
+ @if (!store.isLoading() && store.products().length > 0) {
+   <div class="products-grid">
+     @for (product of store.products(); track product.id) {
+       <app-product-card [product]="product" />
+     }
+   </div>
+ }
```

---

### 3. State Management: Non-computed Derived State

> [!IMPORTANT]
> **Rule Reference (angular-rules.md):**
> _“Derived State: Always use `computed()` for derived state.”_

- **Current State:** `DashboardStatCardComponent` calculates custom class names via a regular function `toneClass()`, which runs on every change detection cycle rather than leveraging reactive caching.
- **Affected File:** `src/app/features/dashboard/components/dashboard-stat-card.component.ts` (Lines 98-100)
- **Refactoring Solution:** Refactor it to a signal-based computed property.

_Before & After in `dashboard-stat-card.component.ts`:_

```diff
-  toneClass(): string {
-    return `tone-${this.tone()}`;
-  }
+  readonly toneClass = computed(() => `tone-${this.tone()}`);
```

---

### 4. Path Aliasing: Relative Imports Cross-Folders

> [!IMPORTANT]
> **Rule Reference (angular-rules.md):**
> _“Always use configured path aliases in imports rather than relative paths: `@core` for core module/services, `@shared` for shared, `@features` for features.”_

- **Current State:** Core components/services are using relative path references `../` cross-directories instead of absolute path aliases.
- **Affected Files:**
  - `src/app/core/guards/auth.guard.ts` (Line 3): `import { AuthService } from '../services/auth.service';`
  - `src/app/core/guards/public.guard.ts` (Line 3): `import { AuthService } from '../services/auth.service';`
  - `src/app/core/interceptors/auth.interceptor.ts` (Line 4): `import { AuthService } from '../services/auth.service';`
  - `src/app/core/interceptors/error.interceptor.ts` (Line 5): `import { getEnvironmentConfig } from '../services/environment.service';`
- **Refactoring Solution:** Update all relative references to use alias `@core/services`.

---

## 🌟 Best Practices Already Followed

1. **Dependency Injection:** Excellent standardizing on the `inject()` pattern in all services and component files (e.g. `AuthService`, `DashboardComponent`, `TodoFormComponent`), removing constructors where possible.
2. **Reactivity & Local State:** Local and page-level variables utilize modern `signal` and `computed` properties, ensuring high-speed updates with zero performance impact.
3. **State Management:** Core logic for listings and mutations uses `@ngrx/signals` Store, cleanly segmenting asynchronous streams (via RxJS operators) from UI templates.
4. **Form Controls:** Modern signal inputs/outputs (`input()`, `output()`) are used, complying with v21 reactive paradigms.

---

## 🛠️ Recommended Code Quality Improvements Checklist

- [ ] Remove `standalone: true` declarations across components to keep metadata clean.
- [ ] Migrate all files to Modern Control Flow (`@if`, `@for`).
- [ ] Convert `toneClass()` function in `dashboard-stat-card.component.ts` into a `computed` property.
- [ ] Clean up relative imports in core guards and interceptors to use path aliases.
- [ ] Run `npx prettier --write .` and `npm run build` after modifications to ensure stability.
