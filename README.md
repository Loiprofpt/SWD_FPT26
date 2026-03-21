---
<div align="center">
  <h1>📐 SWD_FPT26 - Thiết Kế Kiến Trúc Phần Mềm</h1>
  <p><b>Mã môn học:</b> SWD_FPT26 &nbsp;|&nbsp; <b>Tác giả:</b> Pham Viet Loi &nbsp;|&nbsp; <b>Phiên bản:</b> 1.0 &nbsp;|&nbsp; <b>Ngày cập nhật:</b> 05/01/2026</p>
</div>


## 📝 Giới thiệu dự án

Dự án này là một ví dụ thực hành về <b>thiết kế kiến trúc phần mềm</b> cho hệ thống quản lý tổng quát, phục vụ mục tiêu học tập và minh họa các nguyên lý kiến trúc hiện đại. Dự án gồm hai phần chính:

- <b>Backend:</b> Xử lý nghiệp vụ, quản lý dữ liệu, cung cấp API
- <b>Frontend:</b> Giao diện người dùng, tương tác với backend

Dự án giúp sinh viên hiểu và áp dụng các mô hình kiến trúc, phân tách trách nhiệm, đảm bảo khả năng mở rộng, bảo trì và phát triển lâu dài.

---

## 📂 Cấu trúc thư mục

```
SWD_FPT26/
│
├── backend/    # Mã nguồn phía server, API, xử lý nghiệp vụ
├── frontend/   # Mã nguồn giao diện người dùng
└── README.md   # Tài liệu dự án
```

---

## 🎯 Mục tiêu hệ thống

- Xây dựng kiến trúc rõ ràng, có cấu trúc phân lớp
- Phân tách trách nhiệm giữa các thành phần
- Đảm bảo hệ thống dễ mở rộng, bảo trì và nâng cấp
- Giảm sự phụ thuộc giữa các module
- Hỗ trợ phát triển nhóm và kiểm thử

---

## 🧾 Phạm vi & Chức năng chính

<b>Trong phạm vi:</b>
- Quản lý dữ liệu người dùng
- Xử lý nghiệp vụ cốt lõi
- Cung cấp giao diện cho người dùng cuối
- Đảm bảo tính ổn định và bảo mật thông tin

<b>Ngoài phạm vi:</b>
- Tối ưu phần cứng, hạ tầng chi tiết
- Tối ưu hiệu năng ở mức hệ điều hành

---

## 👥 Các bên liên quan (Stakeholders)

| Nhóm           | Vai trò                |
|----------------|------------------------|
| Người dùng     | Sử dụng hệ thống       |
| Nhà phát triển | Xây dựng & bảo trì     |
| Giảng viên     | Đánh giá kiến trúc     |
| Quản lý        | Ra quyết định kỹ thuật |

---

## 📋 Yêu cầu hệ thống

### Chức năng
- Đăng nhập / đăng xuất
- Quản lý thông tin người dùng
- Xử lý nghiệp vụ chính
- Lưu trữ và truy xuất dữ liệu

### Phi chức năng
- Khả năng mở rộng, bảo trì
- Tính sẵn sàng, hiệu năng
- Bảo mật

---

## 🧱 Kiến trúc tổng quan

Hệ thống áp dụng <b>kiến trúc phân lớp (Layered Architecture)</b>:

- <b>Presentation Layer:</b> Giao diện người dùng, nhận input, hiển thị output
- <b>Application Layer:</b> Điều phối luồng xử lý, giao tiếp giữa UI và nghiệp vụ
- <b>Business Logic Layer:</b> Xử lý nghiệp vụ cốt lõi, áp dụng quy tắc hệ thống
- <b>Data Access Layer:</b> Truy xuất dữ liệu, giao tiếp với CSDL

<b>Ưu điểm:</b> Dễ hiểu, dễ bảo trì, phù hợp hệ thống quản lý, hỗ trợ kiểm thử và mở rộng.

---

## 🔄 Luồng hoạt động tổng quát

```mermaid
flowchart TD
    A[Người dùng] --> B[Giao diện (Frontend)]
    B --> C[Xử lý ứng dụng (Backend)]
    C --> D[Nghiệp vụ]
    D --> E[Cơ sở dữ liệu]
```

---

## 🚀 Hướng dẫn khởi động nhanh

1. <b>Clone dự án:</b>
   ```bash
   git clone <repo-url>
   ```
2. <b>Cài đặt phụ thuộc backend & frontend:</b>
   ```bash
   cd backend && <hướng dẫn cài đặt backend>
   cd ../frontend && <hướng dẫn cài đặt frontend>
   ```
3. <b>Khởi động hệ thống:</b>
   ```bash
   # Chạy backend
   cd backend && <lệnh chạy backend>
   # Chạy frontend
   cd ../frontend && <lệnh chạy frontend>
   ```

---

## 📞 Liên hệ & Đóng góp

Mọi ý kiến đóng góp hoặc thắc mắc vui lòng liên hệ tác giả hoặc tạo issue trên repository.

---

<div align="center">
  <b>© 2026 - SWD_FPT26 | Thiết kế Kiến trúc Phần mềm</b>
</div>
