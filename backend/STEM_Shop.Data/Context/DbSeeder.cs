using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Models;
using System.Linq;
using System.Threading.Tasks;

namespace STEM_Shop.Data.Context
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(STEM_Shop_DBContext context)
        {
            // 1. Seed Roles (Nếu chưa có quyền nào)
            if (!await context.Roles.AnyAsync())
            {
                await context.Roles.AddRangeAsync(
                    new Role { RoleName = "Admin" },
                    new Role { RoleName = "Staff" },
                    new Role { RoleName = "Customer" }
                );
                await context.SaveChangesAsync();
            }

            // 2. Seed Categories (Danh mục sản phẩm STEM)
            if (!await context.Categories.AnyAsync())
            {
                await context.Categories.AddRangeAsync(
                    new Category { CategoryName = "Robot Kit", Description = "Robot Kit thông minh cho mọi lứa tuổi" },
                    new Category { CategoryName = "Bo mạch (Board)", Description = "Bo mạch vi điều khiển Arduino, Raspberry Pi,..." },
                    new Category { CategoryName = "Kit học tập (Learning Kit)", Description = "Bộ kit làm quen lập trình cho trẻ" },
                    new Category { CategoryName = "Cảm biến (Sensor)", Description = "Cảm biến nhiệt độ, siêu âm, ánh sáng..." },
                    new Category { CategoryName = "Động cơ (Motor)", Description = "Động cơ Servo, Step, DC..." }
                );
                await context.SaveChangesAsync();
            }

            // 3. Seed Brands (Thương hiệu nổi tiếng)
            if (!await context.Brands.AnyAsync())
            {
                await context.Brands.AddRangeAsync(
                    new Brand { BrandName = "Arduino", Description = "Thương hiệu bo mạch nguồn mở nổi tiếng" },
                    new Brand { BrandName = "Raspberry Pi", Description = "Máy tính nhúng siêu nhỏ gọn" },
                    new Brand { BrandName = "LEGO", Description = "Thương hiệu đồ chơi xếp hình thông minh nâng cao" },
                    new Brand { BrandName = "Makeblock", Description = "Nhà sản xuất thiết bị giáo dục STEM toàn cầu" },
                    new Brand { BrandName = "Micro:bit", Description = "Bo mạch giáo dục do BBC thiết kế" }
                );
                await context.SaveChangesAsync();
            }

            // 4. Seed Products (Lấy theo hình ảnh database bạn đưa)
            if (!await context.Products.AnyAsync())
            {
                var catRobot = await context.Categories.FirstOrDefaultAsync(c => c.CategoryName == "Robot Kit");
                var catBoard = await context.Categories.FirstOrDefaultAsync(c => c.CategoryName == "Bo mạch (Board)");
                var catKit = await context.Categories.FirstOrDefaultAsync(c => c.CategoryName == "Kit học tập (Learning Kit)");
                var catSensor = await context.Categories.FirstOrDefaultAsync(c => c.CategoryName == "Cảm biến (Sensor)");
                var catMotor = await context.Categories.FirstOrDefaultAsync(c => c.CategoryName == "Động cơ (Motor)");

                var brandArduino = await context.Brands.FirstOrDefaultAsync(b => b.BrandName == "Arduino");
                var brandPi = await context.Brands.FirstOrDefaultAsync(b => b.BrandName == "Raspberry Pi");
                var brandLego = await context.Brands.FirstOrDefaultAsync(b => b.BrandName == "LEGO");
                var brandMakeblock = await context.Brands.FirstOrDefaultAsync(b => b.BrandName == "Makeblock");
                var brandMicrobit = await context.Brands.FirstOrDefaultAsync(b => b.BrandName == "Micro:bit");

                await context.Products.AddRangeAsync(
                    new Product
                    {
                        Name = "Arduino Uno R3",
                        Description = "Bo mạch vi điều khiển cơ bản cho người mới bắt đầu",
                        TechnicalSpecs = "Chip ATmega328P, 5V, 14 Digital I/O, 6 Analog IN",
                        AgeRange = "10+",
                        Price = 250000,
                        StockQuantity = 100,
                        ImageUrl = "arduino_uno.jpg",
                        CategoryId = catBoard?.Id,
                        BrandId = brandArduino?.Id
                    },
                    new Product
                    {
                        Name = "Raspberry Pi 4 Model B",
                        Description = "Máy tính nhúng siêu nhỏ gọn, mạnh mẽ",
                        TechnicalSpecs = "RAM 4GB, CPU Quad-Core",
                        AgeRange = "12+",
                        Price = 1650000,
                        StockQuantity = 50,
                        ImageUrl = "pi4_image.jpg",
                        CategoryId = catBoard?.Id,
                        BrandId = brandPi?.Id
                    },
                    new Product
                    {
                        Name = "LEGO Mindstorms Robot Inventor",
                        Description = "Kit lắp ráp robot cao cấp từ LEGO",
                        TechnicalSpecs = "Hỗ trợ lập trình Scratch và Python",
                        AgeRange = "10+",
                        Price = 8500000,
                        StockQuantity = 10,
                        ImageUrl = "lego_robot.jpg",
                        CategoryId = catRobot?.Id,
                        BrandId = brandLego?.Id
                    },
                    new Product
                    {
                        Name = "Cảm biến siêu âm HC-SR04",
                        Description = "Dùng để đo khoảng cách",
                        TechnicalSpecs = "Tầm đo 2cm - 400cm",
                        AgeRange = "8+",
                        Price = 45000,
                        StockQuantity = 200,
                        ImageUrl = "hcsr04.jpg",
                        CategoryId = catSensor?.Id,
                        BrandId = brandArduino?.Id // (Dùng Arduino cho đồ điện tử phụ trợ)
                    },
                    new Product
                    {
                        Name = "Kit học tập Micro:bit V2",
                        Description = "Bộ kit làm quen với lập trình cho trẻ em",
                        TechnicalSpecs = "Tích hợp loa, mic, LED ma trận",
                        AgeRange = "8+",
                        Price = 650000,
                        StockQuantity = 30,
                        ImageUrl = "microbit_v2.jpg",
                        CategoryId = catKit?.Id,
                        BrandId = brandMicrobit?.Id
                    },
                    new Product
                    {
                        Name = "Robot Makeblock mBot Ranger",
                        Description = "Robot 3 trong 1 đa địa hình",
                        TechnicalSpecs = "Bo mạch Me Auriga (dựa trên Arduino Mega 2560)",
                        AgeRange = "10+",
                        Price = 3500000,
                        StockQuantity = 15,
                        ImageUrl = "mbot_ranger.jpg",
                        CategoryId = catRobot?.Id,
                        BrandId = brandMakeblock?.Id
                    },
                    new Product
                    {
                        Name = "Động cơ Servo SG90",
                        Description = "Động cơ servo mini cho các dự án nhỏ",
                        TechnicalSpecs = "Góc quay 180 độ",
                        AgeRange = "8+",
                        Price = 35000,
                        StockQuantity = 150,
                        ImageUrl = "servo_sg90.jpg",
                        CategoryId = catMotor?.Id,
                        BrandId = brandArduino?.Id
                    }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
