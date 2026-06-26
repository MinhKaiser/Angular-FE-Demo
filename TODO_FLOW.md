# Cách Hoạt Động Của Chức Năng Todo

Tài liệu này đào sâu riêng vào feature `todo` trong project, để giải thích rõ:

- route nào đi vào màn todo
- component nào chịu trách nhiệm gì
- store hoạt động ra sao
- gọi API như thế nào
- dữ liệu đi từ UI tới server và quay lại UI như thế nào
- tại sao feature này được tách thành các file như hiện tại

Tài liệu này bám đúng code hiện tại trong repo.

## 1. Mục Tiêu Của Feature Todo

Feature `todo` dùng để hiển thị và quản lý danh sách việc cần làm của user đã đăng nhập.

Trong app này, nó hỗ trợ:

- tải danh sách todo theo user
- thêm todo mới
- cập nhật trạng thái hoàn thành
- xóa todo
- hiển thị loading / lỗi / empty state

Lưu ý:

- API đang dùng là `DummyJSON`
- thêm / sửa / xóa là flow demo frontend, không phải backend thật lâu dài

## 2. Các File Chính Của Feature Todo

```text
src/app/features/todos/
├─ todos-list.component.ts
├─ components/
│  ├─ todo-form.component.ts
│  └─ todo-item.component.ts
└─ state/
   └─ todos.store.ts
```

Ngoài ra feature này còn liên kết với:

- `src/app/core/services/todo.service.ts`
- `src/app/core/services/auth.service.ts`
- `src/app/shared/models/todo.model.ts`
- `src/app/app.routes.ts`
- `src/app/core/guards/auth.guard.ts`

## 3. Route Đi Vào Feature Todo

File liên quan:

- [app.routes.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/app.routes.ts:1)

Route todo:

```ts
{
  path: 'todos',
  loadComponent: () => import('@features/todos').then(m => m.TodosListComponent),
  canActivate: [authGuard],
}
```

Ý nghĩa:

- khi user vào `/todos`, Angular lazy load `TodosListComponent`
- trước khi vào màn này, `authGuard` chạy trước

## 4. Guard Bảo Vệ Màn Todo

File liên quan:

- [auth.guard.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/core/guards/auth.guard.ts:1)

Luồng:

1. User mở `/todos`
2. `authGuard` kiểm tra `authService.isAuthenticated()`
3. Nếu đã đăng nhập:
   - cho vào màn todo
4. Nếu chưa đăng nhập:
   - chuyển sang `/auth/login`
   - kèm `returnUrl=/todos`

Ý nghĩa:

- todo là dữ liệu gắn với user, nên không cho user ẩn danh vào

## 5. Thành Phần Gốc Của Feature Todo

File chính:

- [todos-list.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/todos-list.component.ts:1)

Đây là component trang chính.

Nó chịu trách nhiệm:

- dựng bố cục tổng thể của màn todo
- inject `TodosStore`
- gọi `store.loadTodos()` trong `ngOnInit`
- nối event từ UI xuống store

### 5.1 Các component con mà `TodosListComponent` dùng

- `PageSectionHeaderComponent`
- `TodoFormComponent`
- `TodoItemComponent`
- `StatusBannerComponent`
- `LoadingStateComponent`
- `EmptyStateComponent`

Tức là `TodosListComponent` không ôm hết UI, mà chia nhỏ mỗi phần ra đúng trách nhiệm.

## 6. Thiết Kế Component Của Màn Todo

### 6.1 `TodosListComponent`

Nó là “container component”.

Nó làm 3 việc chính:

1. Lấy dữ liệu từ store
2. Chuyển state sang template
3. Nhận event từ component con và gọi method store tương ứng

Ví dụ trong template:

- form thêm todo:
  - `(addTodo)="store.addTodo($event)"`
- toggle todo:
  - `(toggle)="store.toggleTodo(todo, $event)"`
- delete todo:
  - `(deleteTodo)="store.deleteTodo(todo)"`

Hiểu đơn giản:

- component con chỉ phát event
- component cha quyết định gọi store method nào

Đây là thiết kế phổ biến và sạch:

- UI con không biết store
- store không biết chi tiết UI con
- component cha là nơi điều phối

### 6.2 `TodoFormComponent`

File:

- [todo-form.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/components/todo-form.component.ts:1)

Chức năng:

- hiển thị ô nhập todo
- validate dữ liệu nhập
- phát event `addTodo`
- autofocus khi vào màn todo
- hiển thị số ký tự còn lại

Thiết kế:

- component nhận input:
  - `isSaving`
- component phát output:
  - `addTodo`

Nó không gọi API trực tiếp.

Tại sao?

Vì nếu form gọi API trực tiếp thì component con sẽ biết quá nhiều về nghiệp vụ.

Thiết kế hiện tại sạch hơn:

- form chỉ lo nhập liệu
- component cha nhận event
- store mới lo business logic

### 6.3 `TodoItemComponent`

File:

- [todo-item.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/components/todo-item.component.ts:1)

Chức năng:

- hiển thị 1 dòng todo
- checkbox toggle hoàn thành
- nút delete
- disable khi đang update

Input:

- `todo`
- `isUpdating`

Output:

- `toggle`
- `deleteTodo`

Ý nghĩa thiết kế:

- mỗi item là một component rất mỏng
- chỉ hiển thị 1 todo
- không chứa logic gọi API

Đây là cách tách rất tốt vì:

- dễ tái sử dụng
- dễ test
- dễ đọc

## 7. State Của Feature Todo

File chính:

- [todos.store.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/state/todos.store.ts:1)

Đây là nơi giữ toàn bộ state và logic nghiệp vụ của feature todo.

### 7.1 State đang có

```ts
interface TodosState {
  todos: Todo[];
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string;
  updatingTodoIds: ReadonlySet<number>;
}
```

Ý nghĩa:

- `todos`: danh sách todo đang hiển thị
- `isLoading`: đang load danh sách ban đầu
- `isSaving`: đang thêm todo mới
- `errorMessage`: lỗi hiện tại
- `updatingTodoIds`: những todo nào đang update/xóa

### 7.2 Computed state

Store có:

```ts
completedCount
```

Đây là số lượng todo đã hoàn thành.

Ý nghĩa:

- không cần lưu một state riêng cho số completed
- chỉ cần tính ra từ `todos`
- giúp tránh lệch dữ liệu

Đây là điểm clean code khá tốt trong store này.

## 8. Luồng Tải Danh Sách Todo Ban Đầu

Luồng đầy đủ:

1. User vào `/todos`
2. `authGuard` cho qua nếu đã login
3. Angular render `TodosListComponent`
4. `ngOnInit()` của `TodosListComponent` chạy
5. `this.store.loadTodos()` được gọi
6. Store gọi `authService.user()` để lấy user hiện tại
7. Nếu không có user:
   - patch lỗi `Please sign in to load todos.`
8. Nếu có user:
   - gọi `todoService.getTodosByUser(user.id, { limit: 50, skip: 0 })`
9. Khi API trả về:
   - store patch `todos`
10. Template tự render lại danh sách

### 8.1 Tại sao store phải gọi `AuthService`

Vì todo gắn với user.

Store cần user hiện tại để biết phải gọi endpoint nào:

```ts
/todos/user/:userId
```

Điều đó có nghĩa:

- `TodosStore` phụ thuộc vào `AuthService`
- `TodosStore` không tự quản auth
- `AuthService` là nguồn dữ liệu “ai đang đăng nhập”

## 9. Luồng Gọi API Trong Feature Todo

File service:

- [todo.service.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/core/services/todo.service.ts:1)

### 9.1 API lấy danh sách

Store gọi:

```ts
todoService.getTodosByUser(user.id, { limit: 50, skip: 0 })
```

Service map sang:

```ts
GET /todos/user/:userId
```

### 9.2 API thêm todo

Store gọi:

```ts
todoService.addTodo({
  todo: normalizedTodo,
  completed: false,
  userId: user.id,
})
```

Service map sang:

```ts
POST /todos/add
```

### 9.3 API cập nhật todo

Store gọi:

```ts
todoService.updateTodo(todo.id, { completed })
```

Service map sang:

```ts
PATCH /todos/:id
```

### 9.4 API xóa todo

Store gọi:

```ts
todoService.deleteTodo(todo.id)
```

Service map sang:

```ts
DELETE /todos/:id
```

## 10. Luồng Thêm Todo

Đây là luồng rất quan trọng.

### 10.1 Ở UI

User nhập text vào `TodoFormComponent`.

Form có:

- `FormControl`
- `Validators.required`
- `Validators.maxLength(120)`

Khi submit:

1. Nếu invalid:
   - mark touched
   - dừng
2. Nếu valid:
   - emit `addTodo` với giá trị text
   - reset ô input

### 10.2 Ở component cha

`TodosListComponent` nhận event:

```ts
(addTodo)="store.addTodo($event)"
```

### 10.3 Ở store

`addTodo(todoText: string)` làm:

1. lấy user hiện tại
2. trim chuỗi nhập vào
3. nếu không có user hoặc text rỗng thì dừng
4. patch:
   - `isSaving = true`
   - `errorMessage = ''`
5. gọi `todoService.addTodo(...)`
6. nếu lỗi:
   - patch `Could not create todo.`
7. nếu thành công:
   - thêm todo mới vào đầu mảng:
     ```ts
     todos: [todo, ...store.todos()]
     ```
8. cuối cùng `finalize()` kéo `isSaving` về `false`

### 10.4 Ý nghĩa UX

- nút Add bị disable khi đang save
- input được reset ngay sau emit
- list update ngay khi API trả về

## 11. Luồng Toggle Hoàn Thành

Event bắt đầu từ `TodoItemComponent`:

```ts
(click)="toggle.emit(!todo().completed)"
```

Component cha nhận:

```ts
(toggle)="store.toggleTodo(todo, $event)"
```

Store xử lý:

1. thêm `todo.id` vào `updatingTodoIds`
2. clear error
3. gọi `todoService.updateTodo(todo.id, { completed })`
4. nếu lỗi:
   - hiện lỗi
   - trả fallback là todo cũ
5. nếu thành công:
   - replace item trong danh sách bằng todo mới
6. `finalize()` xóa `todo.id` khỏi `updatingTodoIds`

### Vì sao dùng `updatingTodoIds`

Thay vì chỉ có một biến `isUpdating` chung cho cả list, store dùng `Set<number>`.

Ý nghĩa:

- chỉ disable đúng item đang bị update
- các item khác vẫn tương tác được

Đây là thiết kế tốt hơn khi danh sách có nhiều item.

## 12. Luồng Xóa Todo

Event bắt đầu từ `TodoItemComponent`:

```ts
(click)="deleteTodo.emit()"
```

Component cha nhận:

```ts
(deleteTodo)="store.deleteTodo(todo)"
```

Store xử lý:

1. đánh dấu item đang update
2. clear error
3. gọi `todoService.deleteTodo(todo.id)`
4. nếu lỗi:
   - hiện lỗi
5. nếu thành công:
   - lọc item khỏi mảng `todos`
6. finalize:
   - bỏ `todo.id` khỏi `updatingTodoIds`

## 13. Thiết Kế Giao Diện Của Feature Todo

Màn todo được thiết kế theo kiểu 3 lớp UI:

### 13.1 Header phần trang

`PageSectionHeaderComponent` hiển thị:

- tên trang
- icon
- meta
- chip thống kê số lượng done

Meta đang lấy từ:

```ts
store.completedCount() + ' of ' + store.todos().length + ' completed...'
```

Nghĩa là UI header phản ánh trực tiếp state hiện tại.

### 13.2 Form thêm mới

`TodoFormComponent` nằm trên cùng, ngay dưới header.

Lý do layout này tốt:

- hành động chính nằm gần đầu màn hình
- user dễ thêm item ngay

### 13.3 Danh sách / trạng thái

UI hiển thị theo thứ tự ưu tiên:

1. nếu có lỗi -> `StatusBannerComponent`
2. nếu đang load -> `LoadingStateComponent`
3. nếu có dữ liệu -> render list `TodoItemComponent`
4. nếu không có dữ liệu -> `EmptyStateComponent`

Đây là flow render rất sạch, dễ đọc.

## 14. Mối Liên Kết Giữa Các File

### 14.1 `todos-list.component.ts`

Liên kết với:

- `TodosStore`
- `TodoFormComponent`
- `TodoItemComponent`
- shared UI components

Vai trò:

- trang gốc
- nơi điều phối event UI -> store

### 14.2 `todo-form.component.ts`

Liên kết với:

- `TodosListComponent` qua output `addTodo`

Vai trò:

- chỉ lo input và validation

### 14.3 `todo-item.component.ts`

Liên kết với:

- `TodosListComponent` qua outputs `toggle`, `deleteTodo`

Vai trò:

- chỉ lo render 1 item

### 14.4 `todos.store.ts`

Liên kết với:

- `AuthService`
- `TodoService`
- `TodosListComponent`

Vai trò:

- nghiệp vụ chính của feature todo

### 14.5 `todo.service.ts`

Liên kết với:

- `HttpClientService`

Vai trò:

- map business operation sang endpoint HTTP

### 14.6 `todo.model.ts`

Vai trò:

- chuẩn hóa kiểu dữ liệu cho:
  - service
  - store
  - component

## 15. Tại Sao Thiết Kế Feature Todo Theo Kiểu Này

Feature todo hiện tại đang đi theo hướng:

- UI component mỏng
- business logic nằm ở store
- API call nằm ở service
- type nằm ở model

Ưu điểm:

- dễ bảo trì
- dễ test từng tầng
- ít coupling giữa UI và API
- dễ thay API mà không phải sửa nhiều component

## 16. Nếu Muốn Debug Feature Todo Thì Mở File Nào Trước

Nếu todo bị lỗi, nên đọc theo thứ tự:

1. [todos-list.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/todos-list.component.ts:1)
2. [todos.store.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/state/todos.store.ts:1)
3. [todo.service.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/core/services/todo.service.ts:1)
4. [auth.service.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/core/services/auth.service.ts:1)
5. [error.interceptor.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/core/interceptors/error.interceptor.ts:1)
6. [dev-diagnostics.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/shared/components/dev-diagnostics.component.ts:1)

Nếu UI nhập liệu lỗi, mở thêm:

7. [todo-form.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/components/todo-form.component.ts:1)

Nếu item toggle/delete lỗi, mở thêm:

8. [todo-item.component.ts](/D:/Project/FrontEnd/AngularTest/Angular-FE-Demo/src/app/features/todos/components/todo-item.component.ts:1)

## 17. Tóm Tắt Một Câu

Feature todo của project này hoạt động theo mô hình:

```text
Route bảo vệ bằng authGuard
-> TodosListComponent vào màn
-> TodosStore quản state và nghiệp vụ
-> TodoService gọi DummyJSON API
-> Store patch state
-> UI tự render lại qua signal store
```

Nếu muốn, bước tiếp theo tôi có thể viết tiếp 2 tài liệu tương tự:

- `PRODUCTS_FLOW.md`
- `AUTH_FLOW.md`

Hai file đó sẽ giúp mày hiểu gần như toàn bộ project theo kiểu “đi một chức năng từ đầu tới cuối”.
