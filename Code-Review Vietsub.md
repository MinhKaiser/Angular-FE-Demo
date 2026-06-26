# Code Review - Angular-FE-Demo

---

## 📊 Tổng quan mức độ tuân thủ quy tắc

| Nhóm quy tắc | Quy tắc cụ thể | Trạng thái | Phát hiện / Tệp ảnh hưởng |
| :----------- | :------------ | :--------: | :------------------------ |
| **Angular Decorators** | Không khai báo `standalone: true` (mặc định từ Angular v20+) | ❌ **Vi phạm** | Tất cả các component vẫn khai báo `standalone: true` dư thừa. |
| **Template & Control Flow** | Sử dụng Control Flow mới (`@if`, `@for`, `@switch`) | ❌ **Vi phạm** | Nhiều file vẫn sử dụng `*ngIf` và `*ngFor`. |
| **Quản lý State** | Derived State phải sử dụng `computed()` | ❌ **Vi phạm** | `DashboardStatCardComponent` sử dụng hàm thông thường thay vì `computed()`. |
| **Routing & Thiết lập dự án** | Sử dụng Path Alias, tránh import tương đối giữa các thư mục | ❌ **Vi phạm** | Guards và Interceptors trong Core vẫn dùng `../` thay vì `@core`. |
| **Dependency Injection** | Luôn sử dụng `inject()` | ✅ **Đạt** | Toàn bộ project đã thống nhất sử dụng `inject()` thay cho Constructor Injection. |
| **Reactivity** | Sử dụng Angular Signals để quản lý State | ✅ **Đạt** | State được quản lý bằng Signals, `computed()` và NgRx Signal Store. |
| **Component** | Sử dụng `input()` và `output()` dạng Signal | ✅ **Đạt** | Các component đã sử dụng Signal Inputs/Outputs thay cho `@Input()` và `@Output()`. |
| **Template** | Không sử dụng `ngClass` / `ngStyle` | ✅ **Đạt** | Đã sử dụng Native Class Binding (`[class]`, `[class.xxx]`) đúng chuẩn. |

---

# 🔍 Đánh giá chi tiết & Hướng dẫn cải thiện

## 1. Angular Decorator: Khai báo dư thừa `standalone: true`

> [!IMPORTANT]
> **Quy tắc (angular-rules.md):**
>
> *"Không khai báo `standalone: true` trong Angular Decorator vì từ Angular v20 trở đi, tất cả Component mặc định đều là Standalone."*

### Hiện trạng

Các Component vẫn khai báo:

```ts
standalone: true,
```

Mặc dù dự án đang sử dụng Angular 21, nên khai báo này hoàn toàn không cần thiết.

### Các file bị ảnh hưởng

- `src/app/features/products/product-detail.component.ts` (Dòng 11)
- `src/app/features/products/products-list.component.ts` (Dòng 16)
- `src/app/features/todos/todos-list.component.ts` (Dòng 16)
- `src/app/features/dashboard/dashboard.component.ts` (Dòng 21)
- `src/app/shared/components/header.component.ts` (Dòng 11)
- `src/app/features/todos/components/todo-form.component.ts` (Dòng 9)
- `src/app/features/dashboard/components/dashboard-stat-card.component.ts` (Dòng 8)

### Hướng xử lý

Xóa dòng:

```ts
standalone: true,
```

để metadata của Component ngắn gọn và đúng chuẩn Angular 20+.

---

## 2. Template & Control Flow: Vẫn sử dụng `*ngIf` và `*ngFor`

> [!IMPORTANT]
> **Quy tắc (angular-rules.md):**
>
> *"Ưu tiên sử dụng Native Control Flow (`@if`, `@for`, `@switch`) thay cho `*ngIf`, `*ngFor`, `*ngSwitch`."*

### Hiện trạng

Project vẫn sử dụng các Structural Directive cũ như:

- `*ngIf`
- `*ngFor`

thay vì cú pháp Control Flow mới được Angular khuyến nghị.

### Các file bị ảnh hưởng

- `src/app/features/products/product-detail.component.ts` (Dòng 20, 27, 33)
- `src/app/features/products/products-list.component.ts` (Dòng 50, 57, 62, 64, 70)
- `src/app/features/todos/todos-list.component.ts` (Dòng 45, 52, 57, 59, 68)
- `src/app/features/dashboard/dashboard.component.html` (Dòng 24, 37, 92, 122, 221, 224)
- `src/app/shared/components/header.component.ts` (Dòng 37, 53)

### Hướng xử lý

Thay thế:

- `*ngIf="condition"`

thành

```html
@if (condition) {

}
```

và

- `*ngFor="let item of list; trackBy: trackByFn"`

thành

```html
@for (item of list; track item.id) {

}
```

### Ví dụ

**Trước**

```html
<div *ngIf="!store.isLoading() && store.products().length > 0" class="products-grid">
  <app-product-card
    *ngFor="let product of store.products(); trackBy: trackByProductId"
    [product]="product"
  />
</div>
```

**Sau**

```html
@if (!store.isLoading() && store.products().length > 0) {
  <div class="products-grid">
    @for (product of store.products(); track product.id) {
      <app-product-card [product]="product" />
    }
  </div>
}
```

---

## 3. Quản lý State: Derived State chưa sử dụng `computed()`

> [!IMPORTANT]
> **Quy tắc (angular-rules.md):**
>
> *"Mọi Derived State phải được xây dựng bằng `computed()`."*

### Hiện trạng

Trong `DashboardStatCardComponent`, class CSS được tính thông qua hàm:

```ts
toneClass(): string {
  return `tone-${this.tone()}`;
}
```

Hàm này sẽ được thực thi mỗi lần Angular chạy Change Detection.

### File bị ảnh hưởng

- `src/app/features/dashboard/components/dashboard-stat-card.component.ts` (Dòng 98-100)

### Hướng xử lý

Chuyển sang Signal Computed để Angular chỉ tính toán lại khi giá trị `tone()` thay đổi.

**Trước**

```ts
toneClass(): string {
  return `tone-${this.tone()}`;
}
```

**Sau**

```ts
readonly toneClass = computed(() => `tone-${this.tone()}`);
```

---

## 4. Path Alias: Import tương đối giữa các thư mục

> [!IMPORTANT]
> **Quy tắc (angular-rules.md):**
>
> *"Luôn sử dụng Path Alias (`@core`, `@shared`, `@features`,...) thay cho import tương đối (`../`) khi truy cập giữa các module."*

### Hiện trạng

Một số file trong thư mục `core` vẫn import bằng đường dẫn tương đối:

```ts
../services/auth.service
```

Thay vì sử dụng alias:

```ts
@core/services/auth.service
```

### Các file bị ảnh hưởng

- `src/app/core/guards/auth.guard.ts`

```ts
import { AuthService } from '../services/auth.service';
```

- `src/app/core/guards/public.guard.ts`

```ts
import { AuthService } from '../services/auth.service';
```

- `src/app/core/interceptors/auth.interceptor.ts`

```ts
import { AuthService } from '../services/auth.service';
```

- `src/app/core/interceptors/error.interceptor.ts`

```ts
import { getEnvironmentConfig } from '../services/environment.service';
```

### Hướng xử lý

Thay toàn bộ import tương đối bằng Path Alias:

```ts
import { AuthService } from '@core/services/auth.service';
```

và

```ts
import { getEnvironmentConfig } from '@core/services/environment.service';
```

---

# 🌟 Các điểm đã thực hiện tốt

### 1. Dependency Injection

Toàn bộ project đã thống nhất sử dụng `inject()` thay cho Constructor Injection trong Component và Service (ví dụ: `AuthService`, `DashboardComponent`, `TodoFormComponent`), giúp mã nguồn ngắn gọn và phù hợp với chuẩn Angular hiện đại.

### 2. Reactivity & Local State

State cục bộ và dữ liệu trong Component được quản lý bằng `signal()` và `computed()`, tận dụng cơ chế phản ứng (reactive) của Angular Signals để cập nhật giao diện hiệu quả.

### 3. Quản lý State

Các nghiệp vụ liên quan đến danh sách dữ liệu và thao tác bất đồng bộ được tổ chức bằng `@ngrx/signals` Store, giúp tách biệt rõ ràng giữa logic xử lý dữ liệu và phần giao diện.

### 4. Form Controls

Các Component đã sử dụng `input()` và `output()` dạng Signal thay cho `@Input()` và `@Output()`, phù hợp với mô hình phát triển của Angular 21.

---

# 🛠️ Danh sách cải thiện được đề xuất

- [ ] Xóa toàn bộ khai báo `standalone: true` trong các Component.
- [ ] Chuyển toàn bộ Template sang Native Control Flow (`@if`, `@for`, `@switch`).
- [ ] Chuyển hàm `toneClass()` trong `dashboard-stat-card.component.ts` thành `computed()`.
- [ ] Thay toàn bộ import tương đối trong thư mục `core` bằng Path Alias.
- [ ] Chạy `npx prettier --write .` để chuẩn hóa định dạng mã nguồn.
- [ ] Chạy `npm run build` để kiểm tra dự án sau khi refactor.