USE [master]
GO
/****** Object:  Database [STEM_Shop_DB]    Script Date: 3/26/2026 12:31:40 AM ******/
CREATE DATABASE [STEM_Shop_DB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'STEM_Shop_DB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\STEM_Shop_DB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'STEM_Shop_DB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\STEM_Shop_DB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [STEM_Shop_DB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [STEM_Shop_DB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [STEM_Shop_DB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET ARITHABORT OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [STEM_Shop_DB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [STEM_Shop_DB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [STEM_Shop_DB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [STEM_Shop_DB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET RECOVERY FULL 
GO
ALTER DATABASE [STEM_Shop_DB] SET  MULTI_USER 
GO
ALTER DATABASE [STEM_Shop_DB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [STEM_Shop_DB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [STEM_Shop_DB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [STEM_Shop_DB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [STEM_Shop_DB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [STEM_Shop_DB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'STEM_Shop_DB', N'ON'
GO
ALTER DATABASE [STEM_Shop_DB] SET QUERY_STORE = ON
GO
ALTER DATABASE [STEM_Shop_DB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [STEM_Shop_DB]
GO
/****** Object:  Table [dbo].[Brands]    Script Date: 3/26/2026 12:31:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Brands](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[BrandName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CartItems]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CartItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CartId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Carts]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Carts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InventoryLogs]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InventoryLogs](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[WarehouseId] [int] NULL,
	[ProductId] [int] NULL,
	[Type] [nvarchar](20) NULL,
	[Quantity] [int] NULL,
	[LogDate] [datetime] NULL,
	[Note] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NULL,
	[ProductId] [int] NULL,
	[Quantity] [int] NULL,
	[Price] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NULL,
	[OrderDate] [datetime] NULL,
	[TotalAmount] [int] NULL,
	[Address] [nvarchar](500) NULL,
	[Status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](1000) NULL,
	[TechnicalSpecs] [nvarchar](1000) NULL,
	[AgeRange] [nvarchar](50) NULL,
	[Price] [int] NOT NULL,
	[StockQuantity] [int] NULL,
	[ImageUrl] [nvarchar](500) NULL,
	[CategoryId] [int] NULL,
	[BrandId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Transactions]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transactions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NULL,
	[PaymentMethod] [nvarchar](50) NULL,
	[Status] [nvarchar](50) NULL,
	[TransactionDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[Password] [nvarchar](100) NOT NULL,
	[FullName] [nvarchar](100) NULL,
	[PhoneNumber] [nvarchar](20) NULL,
	[RoleId] [int] NULL,
	[IsBlocked] [int] NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Warehouses]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Warehouses](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[WarehouseName] [nvarchar](100) NOT NULL,
	[Location] [nvarchar](200) NULL,
	[ManagerName] [nvarchar](100) NULL,
	[ContactPhone] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WarehouseStocks]    Script Date: 3/26/2026 12:31:41 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WarehouseStocks](
	[WarehouseId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NULL,
	[UpdatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[WarehouseId] ASC,
	[ProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Brands] ON 
GO
INSERT [dbo].[Brands] ([Id], [BrandName], [Description]) VALUES (1, N'Arduino', NULL)
GO
INSERT [dbo].[Brands] ([Id], [BrandName], [Description]) VALUES (2, N'Raspberry Pi', NULL)
GO
INSERT [dbo].[Brands] ([Id], [BrandName], [Description]) VALUES (3, N'LEGO', NULL)
GO
INSERT [dbo].[Brands] ([Id], [BrandName], [Description]) VALUES (4, N'Raspberry Pi', N'Máy tính mini phổ biến nhất thế giới')
GO
INSERT [dbo].[Brands] ([Id], [BrandName], [Description]) VALUES (5, N'DJI', N'Thương hiệu Robot và Drone hàng đầu thế giới')
GO
INSERT [dbo].[Brands] ([Id], [BrandName], [Description]) VALUES (6, N'Elecfreaks', N'Chuyên cung cấp linh kiện và giáo trình micro:bit')
GO
SET IDENTITY_INSERT [dbo].[Brands] OFF
GO
SET IDENTITY_INSERT [dbo].[Categories] ON 
GO
INSERT [dbo].[Categories] ([Id], [CategoryName], [Description]) VALUES (1, N'Robot', NULL)
GO
INSERT [dbo].[Categories] ([Id], [CategoryName], [Description]) VALUES (2, N'Linh kiện', NULL)
GO
INSERT [dbo].[Categories] ([Id], [CategoryName], [Description]) VALUES (3, N'Kit học tập', NULL)
GO
INSERT [dbo].[Categories] ([Id], [CategoryName], [Description]) VALUES (4, N'Linh kiện Điện tử', N'Các bo mạch, cảm biến, vi điều khiển thay thế')
GO
INSERT [dbo].[Categories] ([Id], [CategoryName], [Description]) VALUES (5, N'Đồ chơi Gỗ thông minh', N'Đồ chơi lắp ráp STEM từ gỗ an toàn, thân thiện môi trường')
GO
SET IDENTITY_INSERT [dbo].[Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (1, N'Arduino Uno R3', NULL, NULL, NULL, 250000, 100, NULL, 2, 1)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (2, N'DJI RoboMaster S1', N'Robot AI giáo dục tối tân của DJI, hỗ trợ lập trình Scratch và Python. Khả năng vượt qua mọi địa hình với bánh xe Mecanum và trang bị súng bắn gel nước.', N'Camera HD, Nhận diện khuôn mặt AI, Bánh xe Mecanum', N'12+', 12500000, 15, N'https://storm.biz.vn/wp-content/uploads/2019/07/dji-robomaster-s1_8-1-800x800.jpg', 1, 5)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (3, N'Makeblock CyberPi', N'Bo mạch thông minh dạng gamepad với màn hình màu, tích hợp Wifi và Bluetooth. Tuyệt vời để học AI (Trí tuệ nhân tạo) và IoT (Vạn vật kết nối).', N'Màn hình màu TFT, Joystick, Tích hợp Wifi/Bluetooth', N'8+', 1850000, 50, N'https://store.makeblock.com/wp-content/uploads/2021/01/P1010132_cyberpi.jpg', 1, 2)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (4, N'Robot Phân loại Rác AI', N'Bộ robot khoa học trang bị camera có khả năng nhận diện và phân loại rác thải hoàn toàn tự động dựa trên Machine Learning.', N'Camera AI, 4x Động cơ Servo, Khung Mica bền bỉ', N'10+', 4500000, 30, N'https://bizweb.dktcdn.net/100/409/063/products/z4318357039014-9fdbe2da5b14ea4ec93eaf264e525a75-1683260786576.jpg?v=1683260790587', 1, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (5, N'LEGO Education SPIKE Prime', N'Giải pháp học tập STEAM hàng đầu của LEGO, giúp học sinh phát triển tư duy thuật toán và lập trình ứng dụng.', N'Hub 6 cổng, Động cơ lớn/nhỏ, Cảm biến ánh sáng & màu', N'10+', 11500000, 20, N'https://legoeducation.com/assets/f_auto,c_lpad,h_800,w_800/v1612423377/lego-education/products/45678.jpg', 1, 1)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (6, N'Robot Cún Thông Minh Bittle', N'Robot chó mã nguồn mở kích thước bằng lòng bàn tay, di chuyển sinh học như thật, dễ dàng lập trình trực quan bằng Python/C++.', N'Cử động sinh học, 9 Micro servo, Khung in 3D', N'14+', 6800000, 10, N'https://www.petoi.com/cdn/shop/files/petoi-bittle-robot-dog-kit-v2-main-image.jpg?v=1734261622&width=1600', 1, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (7, N'Mô hình Cánh tay Robot Thủy lực', N'Bộ lắp ráp cánh tay robot hoạt động hoàn toàn dựa trên áp suất chất lỏng (thủy lực), không cần dùng pin hay điện. Minh họa vật lý tuyệt vời.', N'Gỗ ép an toàn, Xi lanh bơm 5ml x4', N'8+', 450000, 100, N'https://product.hstatic.net/1000185906/product/thuy-luc_981504bb01394b30a59da4c0529eafab.jpg', 2, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (8, N'Mô hình Hệ Mặt Trời Gỗ Xoay Tự Động', N'Bé tự tay lắp ráp và tô màu hệ mặt trời. Sản phẩm tích hợp động cơ điện giúp các hành tinh xoay chậm rãi quanh tâm.', N'Gỗ ép 3mm cắt laser, Động cơ giảm tốc 3V', N'6+', 350000, 150, N'https://bizweb.dktcdn.net/100/443/512/products/z3999990595304-45318db832cd4ea76a0319ca7df1ee8b.jpg?v=1672304918237', 2, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (9, N'LEGO Technic Siêu xe Bugatti Bolide', N'Chi tiết cơ khí mô phỏng động cơ W16 và cơ cấu lái chân thực, kích thích tư duy kỹ thuật động cơ.', N'905 mảnh ghép cao cấp, Cửa xe dạng cắt kéo', N'9+', 1450000, 80, N'https://www.lego.com/cdn/cs/set/assets/blt56e18f8e8f85f16e/42151.png', 2, 1)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (10, N'Mô hình Máy bay Khí động học', N'Khung máy bay bằng xốp balsa và gỗ siêu nhẹ, tích hợp động cơ cánh quạt quay siêu tít giúp chiếc phi cơ trực tiếp chạy trên sàn.', N'Vật liệu xốp/dây chun, Pin AA x2', N'7+', 200000, 250, N'https://cf.shopee.vn/file/edcd028e752c0029b35252ed7a6fb36d', 2, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (11, N'Kính Thiên Văn Không Gian Cho Bé', N'Kính viễn vọng khúc xạ giúp trẻ em quan sát mặt trăng, các chòm sao rõ nét vào ban đêm. Giúp khơi dậy niềm đam mê vũ trụ.', N'Độ phóng đại 150X, Chân nhôm tripod vững chãi', N'8+', 1250000, 45, N'https://bizweb.dktcdn.net/100/409/063/products/51st5ovsbtl-ac-sl1000.jpg?v=1675239921607', 3, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (12, N'Bộ Nuôi Tinh Thể Pha Lê Màu', N'Bộ thí nghiệm trồng tinh thể tuyệt đẹp tại nhà, giúp bé quan sát sự kết tinh của muối và phản ứng hóa học bão hòa.', N'Cốc nhựa chịu nhiệt, Phẩm màu, Cát tinh thể', N'6+', 180000, 300, N'https://down-vn.img.susercontent.com/file/sg-11134201-22110-y8d6c7u9y6jv97', 3, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (13, N'Pin Trái Cây Đa Chiều', N'Thí nghiệm Vật lý điện từ cổ điển: Thắp sáng bóng đèn nhỏ từ năng lượng của quả chanh và khoai tây.', N'Điện cực Đồng & Kẽm, Dây kẹp cá sấu, Đồng hồ LED mini', N'6+', 120000, 500, N'https://bizweb.dktcdn.net/100/035/381/products/k1.jpg', 3, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (14, N'Bộ Kính Hiển Vi Sinh Học Mini', N'Bộ kính hiển vi mini bỏ túi cho trẻ em, có đèn LED trợ sáng để soi các mẫu tế bào, xác thực vật với độ phóng siêu cao.', N'Phóng đại 1200x, Đèn chiếu sáng LED, Lam kính chuẩn', N'8+', 480000, 75, N'https://nhasachphuongnam.com/images/thumbnails/800/800/detailed/246/bo-kinh-hien-vi-1.jpg', 3, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (15, N'Raspberry Pi 5 4GB RAM', N'Board mạch máy tính mini thế hệ mới, sức mạnh tương đương máy bàn, hỗ trợ cổng PCIe và xuất hai màn hình 4K.', N'CPU Boardcom 2.4GHz Quad, 4GB RAM LPDDR4', N'14+', 2200000, 60, N'https://cytron.io/image/cache/catalog/products/RPI-5-4GB/RPI-5-4GB-p01-800x800.jpg', 4, 4)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (16, N'Mạch Lập Trình Micro:Bit V2', N'Mạch vi điều khiển cho trẻ em cực thịnh hành ở Châu Âu. Tích hợp loa, micro và logo cảm ứng trên mặt trước.', N'NORDIC ARM Cortex-M4, Loa báo động, LED ma trận 5x5', N'8+', 650000, 150, N'https://cdn.shopify.com/s/files/1/0273/9389/6530/products/microbitV2-front_800x.png', 4, 6)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (17, N'Cảm biến Siêu âm HC-SR04', N'Mắt siêu âm quốc dân dùng cho mọi mô hình xe tự hành arduino nhằm mục đích đo khoảng cách và tránh vật cản.', N'Tắt/Mở bằng sóng âm, Đo xa MAX 400cm, Nguồn cấp 5V', N'10+', 28000, 1000, N'https://hshop.vn/images/thumbs/000/0009581_cam-bien-sieu-am-hc-sr04.jpeg', 4, 3)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (18, N'Động cơ Servo SG90', N'Động cơ quay biên độ 180 độ mini, linh kiện nhông nhựa siêu nhẹ không thể thiếu trong các cánh tay robot nhựa.', N'Lực kéo xoắn 1.6kg/cm, 3 cực nguồn cắm', N'10+', 35000, 800, N'https://hshop.vn/images/thumbs/000/0009575_dong-co-rc-servo-sg90.jpeg', 4, NULL)
GO
INSERT [dbo].[Products] ([Id], [Name], [Description], [TechnicalSpecs], [AgeRange], [Price], [StockQuantity], [ImageUrl], [CategoryId], [BrandId]) VALUES (19, N'Kit Học Arduino RFID Toàn Diện', N'Phiên bản nâng cấp bao gồm trọn bộ hơn 200 module: cảm biến âm thanh, màn hình LCD xanh lá, còi chip, điều khiển hồng ngoại và thẻ từ RFID.', N'Mạch Uno R3 CH340, Hộp nhựa nhiều ngăn', N'12+', 750000, 95, N'https://hshop.vn/images/detailed/4/Kit-hoc-tap-Arduino-Uno-R3-RFID-1.jpg', 4, 3)
GO
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 
GO
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (1, N'Admin')
GO
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (2, N'Staff')
GO
INSERT [dbo].[Roles] ([Id], [RoleName]) VALUES (3, N'Member')
GO
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([Id], [Email], [Password], [FullName], [PhoneNumber], [RoleId], [IsBlocked], [CreatedAt]) VALUES (1, N'admin@gmail.com', N'123456', N'Mr Admin', NULL, 1, 0, CAST(N'2026-03-25T15:32:39.223' AS DateTime))
GO
INSERT [dbo].[Users] ([Id], [Email], [Password], [FullName], [PhoneNumber], [RoleId], [IsBlocked], [CreatedAt]) VALUES (2, N'staff@gmail.com', N'123456', N'Staff User', NULL, 2, 0, CAST(N'2026-03-25T18:50:04.467' AS DateTime))
GO
INSERT [dbo].[Users] ([Id], [Email], [Password], [FullName], [PhoneNumber], [RoleId], [IsBlocked], [CreatedAt]) VALUES (3, N'ploipro0404@gmail.com', N'123456', N'Lợi Phạm Viết', N'0349936436', 3, 0, CAST(N'2026-03-25T18:54:42.860' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
SET IDENTITY_INSERT [dbo].[Warehouses] ON 
GO
INSERT [dbo].[Warehouses] ([Id], [WarehouseName], [Location], [ManagerName], [ContactPhone]) VALUES (1, N'Kho Chính HCM', N'Quận 9, TP.HCM', NULL, NULL)
GO
INSERT [dbo].[Warehouses] ([Id], [WarehouseName], [Location], [ManagerName], [ContactPhone]) VALUES (2, N'Kho Phụ Hà Nội', N'Cầu Giấy, Hà Nội', NULL, NULL)
GO
SET IDENTITY_INSERT [dbo].[Warehouses] OFF
GO
ALTER TABLE [dbo].[InventoryLogs] ADD  DEFAULT (getdate()) FOR [LogDate]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (getdate()) FOR [OrderDate]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [StockQuantity]
GO
ALTER TABLE [dbo].[Transactions] ADD  DEFAULT (getdate()) FOR [TransactionDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((3)) FOR [RoleId]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [IsBlocked]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[WarehouseStocks] ADD  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[WarehouseStocks] ADD  DEFAULT (getdate()) FOR [UpdatedAt]
GO
ALTER TABLE [dbo].[CartItems]  WITH CHECK ADD  CONSTRAINT [FK_CartItem_Cart] FOREIGN KEY([CartId])
REFERENCES [dbo].[Carts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CartItems] CHECK CONSTRAINT [FK_CartItem_Cart]
GO
ALTER TABLE [dbo].[CartItems]  WITH CHECK ADD  CONSTRAINT [FK_CartItem_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CartItems] CHECK CONSTRAINT [FK_CartItem_Product]
GO
ALTER TABLE [dbo].[Carts]  WITH CHECK ADD  CONSTRAINT [FK_Cart_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Carts] CHECK CONSTRAINT [FK_Cart_User]
GO
ALTER TABLE [dbo].[InventoryLogs]  WITH CHECK ADD  CONSTRAINT [FK_Log_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[InventoryLogs] CHECK CONSTRAINT [FK_Log_Product]
GO
ALTER TABLE [dbo].[InventoryLogs]  WITH CHECK ADD  CONSTRAINT [FK_Log_Warehouse] FOREIGN KEY([WarehouseId])
REFERENCES [dbo].[Warehouses] ([Id])
GO
ALTER TABLE [dbo].[InventoryLogs] CHECK CONSTRAINT [FK_Log_Warehouse]
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_Detail_Order] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_Detail_Order]
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD  CONSTRAINT [FK_Detail_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[OrderDetails] CHECK CONSTRAINT [FK_Detail_Product]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD  CONSTRAINT [FK_Order_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Orders] CHECK CONSTRAINT [FK_Order_User]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Product_Brand] FOREIGN KEY([BrandId])
REFERENCES [dbo].[Brands] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Product_Brand]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Product_Category] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Product_Category]
GO
ALTER TABLE [dbo].[Transactions]  WITH CHECK ADD  CONSTRAINT [FK_Tran_Order] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[Transactions] CHECK CONSTRAINT [FK_Tran_Order]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_User_Role] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_User_Role]
GO
ALTER TABLE [dbo].[WarehouseStocks]  WITH CHECK ADD  CONSTRAINT [FK_Stock_Product] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[WarehouseStocks] CHECK CONSTRAINT [FK_Stock_Product]
GO
ALTER TABLE [dbo].[WarehouseStocks]  WITH CHECK ADD  CONSTRAINT [FK_Stock_Warehouse] FOREIGN KEY([WarehouseId])
REFERENCES [dbo].[Warehouses] ([Id])
GO
ALTER TABLE [dbo].[WarehouseStocks] CHECK CONSTRAINT [FK_Stock_Warehouse]
GO
USE [master]
GO
ALTER DATABASE [STEM_Shop_DB] SET  READ_WRITE 
GO
