# STEM Shop - Nền tảng thương mại điện tử sản phẩm STEM

Website bán hàng STEM (Science, Technology, Engineering, Mathematics) với đầy đủ chức năng: Đăng ký/Đăng nhập, Giỏ hàng, Thanh toán VNPay, Quản lý Kho, Admin Dashboard.

## 🛠️ Công Nghệ

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18 + Vite, Zustand, Framer Motion, Axios |
| **Backend** | .NET 9 Web API, Entity Framework Core |
| **Database** | SQL Server 2022 |
| **Cloud** | Cloudinary (Upload ảnh sản phẩm) |

## 📋 Yêu cầu hệ thống

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/) (khuyến nghị LTS)
- [SQL Server 2022](https://www.microsoft.com/sql-server) (hoặc SQL Server Express)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/ssms/download-sql-server-management-studio-ssms)

## 🚀 Hướng dẫn cài đặt

### Bước 1: Tạo Database

1. Mở **SSMS**, kết nối vào SQL Server local (`localhost`, User: `sa`, Pass: `123456`).
2. Mở file `database/STEM_Shop_DB.sql`.
3. Nhấn **Execute (F5)** để tạo Database + dữ liệu mẫu.

### Bước 2: Chạy Backend

```bash
cd backend/STEM_Shop.API
dotnet run --launch-profile https
```

Backend sẽ chạy tại: `https://localhost:7142`

### Bước 3: Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 👤 Tài khoản mẫu

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| **Admin** | admin@gmail.com | 123456 |
| **Staff** | staff@gmail.com | 123456 |
| **Member** | ploipro0404@gmail.com | 123456 |

## 📁 Cấu trúc dự án

```
SWD_FPT26/
├── database/               # Script SQL tạo DB + dữ liệu mẫu
│   └── STEM_Shop_DB.sql
├── backend/                # .NET 9 Web API
│   ├── STEM_Shop.API/      # Controllers, Program.cs
│   ├── STEM_Shop.Services/ # Business Logic, DTOs
│   └── STEM_Shop.Data/     # EF Core Models, DbContext
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # Header, ProductCard, Footer...
│   │   ├── pages/          # Home, Products, Cart, Checkout...
│   │   └── store/          # Zustand state management
│   └── index.html
└── README.md
```

## ✨ Tính năng chính

- 🛒 **Mua sắm**: Duyệt sản phẩm, Filter/Sort, tìm kiếm, giỏ hàng (lưu localStorage)
- 💳 **Thanh toán**: COD, Chuyển khoản, VNPay (mô phỏng QR)
- 👤 **Phân quyền**: Guest → Member → Staff → Admin
- 📦 **Quản lý kho**: Nhập hàng, xuất kho tự động khi đặt đơn, log biến động
- 📋 **Admin Dashboard**: CRUD Sản phẩm, Danh mục, Thương hiệu, Đơn hàng, Người dùng, Kho hàng
- 🔒 **Bảo mật**: JWT Authentication, Validate SĐT chuẩn VN, Email format

## ⚙️ Cấu hình

Connection String mặc định trong `backend/STEM_Shop.API/appsettings.json`:

```
Server=localhost;Database=STEM_Shop_DB;User Id=sa;Password=123456;TrustServerCertificate=True
```

> Nếu SQL Server của bạn dùng Windows Authentication hoặc password khác, hãy sửa lại file `appsettings.json`.
