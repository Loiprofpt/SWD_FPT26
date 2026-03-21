
CREATE DATABASE STEM_Shop_DB;
GO
USE STEM_Shop_DB;
GO

-- 1. Bảng Quyền hạn (Cố định: 1-Admin, 2-Staff, 3-Member)
CREATE TABLE Roles (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL
);

-- 2. Bảng Thương hiệu
CREATE TABLE Brands (
    Id INT PRIMARY KEY IDENTITY(1,1),
    BrandName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500)
);

-- 3. Bảng Danh mục
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500)
);

-- 4. Bảng Người dùng 
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(100) NOT NULL,
    Password NVARCHAR(100) NOT NULL, 
    FullName NVARCHAR(100),
    PhoneNumber NVARCHAR(20),
    RoleId INT DEFAULT 3, -- Mặc định là Member
    IsBlocked INT DEFAULT 0, -- 0: hoạt động, 1: bị khóa
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_User_Role FOREIGN KEY (RoleId) REFERENCES Roles(Id)
);

-- 5. Bảng Sản phẩm
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    TechnicalSpecs NVARCHAR(1000),
    AgeRange NVARCHAR(50),
    Price INT NOT NULL, -- Dùng INT cho giá tiền nếu không cần xu/cào
    StockQuantity INT DEFAULT 0,
    ImageUrl NVARCHAR(500),
    CategoryId INT,
    BrandId INT,
    CONSTRAINT FK_Product_Category FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    CONSTRAINT FK_Product_Brand FOREIGN KEY (BrandId) REFERENCES Brands(Id)
);

-- 6. Bảng Đơn hàng
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount INT,
    Address NVARCHAR(500),
    Status NVARCHAR(50), -- 'Pending', 'Shipping', 'Done'
    CONSTRAINT FK_Order_User FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- 7. Bảng Chi tiết đơn hàng
CREATE TABLE OrderDetails (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT,
    ProductId INT,
    Quantity INT,
    Price INT, -- Lưu giá lúc mua
    CONSTRAINT FK_Detail_Order FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    CONSTRAINT FK_Detail_Product FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

-- 8. Bảng Giao dịch 
CREATE TABLE Transactions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT,
    PaymentMethod NVARCHAR(50), -- 'ATM', 'Momo', 'COD'
    Status NVARCHAR(50), -- 'Success', 'Fail'
    TransactionDate DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Tran_Order FOREIGN KEY (OrderId) REFERENCES Orders(Id)
);



INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Staff'), ('Member');

INSERT INTO Brands (BrandName) VALUES ('Arduino'), ('Raspberry Pi'), ('LEGO');

INSERT INTO Categories (CategoryName) VALUES (N'Robot'), (N'Linh kiện'), (N'Kit học tập');

-- Tài khoản test: admin@gmail.com / 123456
INSERT INTO Users (Email, Password, FullName, RoleId) 
VALUES ('admin@gmail.com', '123456', 'Mr Admin', 1);

INSERT INTO Products (Name, Price, StockQuantity, CategoryId, BrandId)
VALUES (N'Arduino Uno R3', 250000, 100, 2, 1);