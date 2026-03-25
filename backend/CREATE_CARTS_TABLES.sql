USE [STEM_Shop_DB];
GO

-- Chạy Script này để tạo 2 bảng đang bị thiếu trong SQL Server của bạn

-- 1. Tạo Bảng Carts (Giỏ hàng)
CREATE TABLE [dbo].[Carts] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [UserId] INT NOT NULL,
    CONSTRAINT [FK_Cart_User] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
);

-- 2. Tạo Bảng CartItems (Các sản phẩm bên trong Giỏ hàng)
CREATE TABLE [dbo].[CartItems] (
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [CartId] INT NOT NULL,
    [ProductId] INT NOT NULL,
    [Quantity] INT NOT NULL,
    CONSTRAINT [FK_CartItem_Cart] FOREIGN KEY ([CartId]) REFERENCES [dbo].[Carts] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CartItem_Product] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products] ([Id]) ON DELETE CASCADE
);
GO
