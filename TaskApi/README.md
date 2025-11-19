Task Manager — Web API + React
Hướng dẫn này mô tả cách thiết lập và chạy cả dịch vụ Backend (API) và Frontend (React client).

A.Cách chạy Backend (TaskApi)
Backend được xây dựng bằng .NET Core.

1. Mở Terminal và di chuyển vào thư mục Backend:
cd TaskApi

2. Cập nhật Cơ sở dữ liệu (Áp dụng các Migration):
dotnet ef database update

3. Khởi chạy dịch vụ Backend:
dotnet run

Dịch vụ Backend sẽ chạy tại: http://localhost:5274

Bạn có thể truy cập giao diện Swagger (OpenAPI) để kiểm tra các endpoint API tại: http://localhost:5000/swagger

B. Cách chạy Frontend (task-client)
Frontend được xây dựng bằng React và Vite.

1. Mở Terminal mới và di chuyển vào thư mục Frontend:
cd task-client

2. Cài đặt các gói phụ thuộc (Chỉ cần làm lần đầu tiên):
npm install

3. Khởi chạy ứng dụng Frontend:
npm run dev

Ứng dụng Frontend sẽ chạy tại: http://localhost:5173