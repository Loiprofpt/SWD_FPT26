-- Dữ liệu Mẫu (Sample Data) cho STEM Shop
-- Chạy trên SQL Server Management Studio

-- ==========================================
-- 1. CHÈN VAI TRÒ (ROLES)
-- ==========================================
SET IDENTITY_INSERT Roles ON;
IF NOT EXISTS (SELECT * FROM Roles WHERE Id = 1)
BEGIN
    INSERT INTO Roles (Id, RoleName) VALUES 
    (1, 'Admin'),
    (2, 'Staff'),
    (3, 'Customer');
END
SET IDENTITY_INSERT Roles OFF;

-- ==========================================
-- 2. CHÈN NGƯỜI DÙNG (USERS)
-- ==========================================
-- Mật khẩu ở đây là mã Hash BCrypt của chuỗi "123456"
-- (Vì backend .NET của bạn dùng thuật toán BCrypt.Verify)
SET IDENTITY_INSERT Users ON;
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@gmail.com')
BEGIN
    INSERT INTO Users (Id, Email, Password, FullName, PhoneNumber, RoleId, IsBlocked, CreatedAt)
    VALUES 
    (1, 'admin@gmail.com', '$2a$10$X8a307g9BwO.80f/7gN/s.zW8L.FWe79t2I.RStB7aR6E161.4x9i', N'Quản trị viên', '0987654321', 1, 0, GETDATE()),
    (2, 'khachhang@gmail.com', '$2a$10$X8a307g9BwO.80f/7gN/s.zW8L.FWe79t2I.RStB7aR6E161.4x9i', N'Nguyễn Văn Khách', '0123456789', 3, 0, GETDATE());
END
SET IDENTITY_INSERT Users OFF;

-- ==========================================
-- 3. CHÈN DANH MỤC (CATEGORIES)
-- ==========================================
SET IDENTITY_INSERT Categories ON;
IF NOT EXISTS (SELECT * FROM Categories WHERE Id = 1)
BEGIN
    INSERT INTO Categories (Id, CategoryName, Description) VALUES
    (1, N'Robot Lập trình', N'Đồ chơi STEM dạng robot lập trình thông minh'),
    (2, N'Mô hình Lắp ráp', N'Đồ chơi lắp ráp trí tuệ STEM rèn luyện tư duy'),
    (3, N'Thí nghiệm Khoa học', N'Các bộ kít thí nghiệm vật lý, hoá học sinh động');
END
SET IDENTITY_INSERT Categories OFF;

-- ==========================================
-- 4. CHÈN THƯƠNG HIỆU (BRANDS)
-- ==========================================
SET IDENTITY_INSERT Brands ON;
IF NOT EXISTS (SELECT * FROM Brands WHERE Id = 1)
BEGIN
    INSERT INTO Brands (Id, BrandName, Description) VALUES
    (1, N'LEGO Education', N'Thương hiệu đồ chơi giáo dục số 1 thế giới'),
    (2, N'Makeblock', N'Nhà cung cấp giải pháp giáo dục STEAM hàng đầu'),
    (3, N'Arduino', N'Bo mạch mã nguồn mở siêu phổ biến');
END
SET IDENTITY_INSERT Brands OFF;

-- ==========================================
-- 5. CHÈN SẢN PHẨM (PRODUCTS)
-- ==========================================
SET IDENTITY_INSERT Products ON;
IF NOT EXISTS (SELECT * FROM Products WHERE Id = 1)
BEGIN
    INSERT INTO Products (Id, Name, Description, Price, StockQuantity, AgeRange, ImageUrl, TechnicalSpecs, CategoryId, BrandId) VALUES
    (1, N'Robot Lập trình mBot Ranger', N'Robot lập trình mBot phiên bản Ranger 3 trong 1 tiên tiến, giúp bé làm quen với lập trình block.', 3500000, 50, '8-14', 'https://store.makeblock.com/wp-content/uploads/2016/11/mbot-ranger-robot-kit-4-500x500.jpg', N'Bluetooth, Arduino Mega 2560', 1, 2),
    (2, N'Bộ Lắp Ráp LEGO Mindstorms EV3', N'Bộ não robot mạnh mẽ của LEGO dành cho thi đấu và học tập chuyên sâu.', 9800000, 15, '10+', 'https://www.lego.com/cdn/cs/set/assets/bltefff6581454c7d0d/31313.jpg', N'ARM9, Bluetooth, Wi-Fi', 1, 1),
    (3, N'Arduino Uno R3 Starter Kit', N'Bộ học lập trình vi điều khiển cho người mới bắt đầu với hơn 50 linh kiện.', 450000, 200, '12+', 'https://store.arduino.cc/cdn/shop/products/K000007_00.b_1000x750.jpg', N'ATmega328P, 5V', 3, 3),
    (4, N'Bộ Thí nghiệm Hoá học Mini', N'Khám phá phản ứng hoá học an toàn với 20 bài thực hành.', 250000, 100, '8-12', 'https://m.media-amazon.com/images/I/41DXY0TfW-L.jpg', N'An toàn, nhựa ABS', 3, NULL);
END
SET IDENTITY_INSERT Products OFF;
