# OhStem - Backend (ASP.NET)

Đây là phần backend của dự án OhStem - website bán đồ STEM. Backend được xây dựng bằng công nghệ ASP.NET, cung cấp API phục vụ cho frontend và quản lý dữ liệu hệ thống.

## Chức năng chính
- Quản lý sản phẩm STEM
- Quản lý người dùng (đăng ký, đăng nhập, phân quyền)
- Quản lý đơn hàng, giỏ hàng
- Xử lý thanh toán và lịch sử mua hàng
- Kết nối cơ sở dữ liệu để lưu trữ thông tin
- Cung cấp API RESTful cho frontend

## Công nghệ sử dụng
- ASP.NET Core
- Entity Framework Core
- SQL Server (hoặc hệ quản trị cơ sở dữ liệu tương thích)
- JWT Authentication
- Swagger (tài liệu API)

## Hướng dẫn chạy backend
1. Cài đặt .NET SDK (phiên bản phù hợp, ví dụ: .NET 6 trở lên)
2. Mở terminal tại thư mục `backend`
3. Cài đặt các package cần thiết:
   ```bash
   dotnet restore
   ```
4. Cấu hình chuỗi kết nối database trong file `appsettings.json`
5. Chạy ứng dụng:
   ```bash
   dotnet run
   ```
6. API sẽ chạy mặc định tại `https://localhost:5001` hoặc `http://localhost:5000`

## Đóng góp
Mọi ý kiến đóng góp hoặc báo lỗi xin gửi về nhóm phát triển dự án OhStem.

---
**OhStem - Backend ASP.NET**
