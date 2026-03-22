using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly STEM_Shop_DBContext _context;
        private readonly IConfiguration _configuration;

        public ProductService(STEM_Shop_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<ApiResponse<List<ProductResponse>>> GetAllProductsAsync(string? search = null, int? minPrice = null, int? maxPrice = null, int? categoryId = null)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Name.Contains(search) || (p.Description != null && p.Description.Contains(search)));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            var products = await query.ToListAsync();

            var dtos = products.Select(p => new ProductResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                TechnicalSpecs = p.TechnicalSpecs,
                AgeRange = p.AgeRange,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.CategoryName,
                BrandId = p.BrandId,
                BrandName = p.Brand?.BrandName
            }).ToList();

            return new ApiResponse<List<ProductResponse>>
            {
                Success = true,
                Message = "Lấy danh sách thành công",
                Data = dtos
            };
        }

        public async Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id)
        {
            var p = await _context.Products
                .Include(pr => pr.Category)
                .Include(pr => pr.Brand)
                .FirstOrDefaultAsync(pr => pr.Id == id);
                
            if (p == null)
            {
                return new ApiResponse<ProductResponse> { Success = false, Message = "Product not found" };
            }

            var dto = new ProductResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                TechnicalSpecs = p.TechnicalSpecs,
                AgeRange = p.AgeRange,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.CategoryName,
                BrandId = p.BrandId,
                BrandName = p.Brand?.BrandName
            };
            return new ApiResponse<ProductResponse>
            {
                Success = true,
                Message = "Lấy thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<ProductResponse>> CreateProductAsync(CreateProductRequest request)
        {
            string? uploadedImageUrl = null;
            if (request.ImageFile != null && request.ImageFile.Length > 0)
            {
                var cloudName = _configuration["Cloudinary:CloudName"];
                var apiKey = _configuration["Cloudinary:ApiKey"];
                var apiSecret = _configuration["Cloudinary:ApiSecret"];

                var account = new Account(cloudName, apiKey, apiSecret);
                var cloudinary = new Cloudinary(account);
                using var stream = request.ImageFile.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(request.ImageFile.FileName, stream),
                    Folder = "products"
                };
                var uploadResult = await cloudinary.UploadAsync(uploadParams);
                uploadedImageUrl = uploadResult.SecureUrl.ToString();
            }

            int maxId = await _context.Products.MaxAsync(p => (int?)p.Id) ?? 0;
            await _context.Database.ExecuteSqlRawAsync($"DBCC CHECKIDENT ('Products', RESEED, {maxId})");

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                TechnicalSpecs = request.TechnicalSpecs,
                AgeRange = request.AgeRange,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                ImageUrl = uploadedImageUrl,
                CategoryId = request.CategoryId,
                BrandId = request.BrandId
            };

            _context.Products.Add(product);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return new ApiResponse<ProductResponse>
                {
                    Success = false,
                    Message = "CategoryId hoặc BrandId không tồn tại."
                };
            }

            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            await _context.Entry(product).Reference(p => p.Brand).LoadAsync();

            var dto = new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                TechnicalSpecs = product.TechnicalSpecs,
                AgeRange = product.AgeRange,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.CategoryName,
                BrandId = product.BrandId,
                BrandName = product.Brand?.BrandName
            };

            return new ApiResponse<ProductResponse>
            {
                Success = true,
                Message = "Tạo thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<ProductResponse>> UpdateProductAsync(int id, UpdateProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return new ApiResponse<ProductResponse> { Success = false, Message = "Product not found" };
            }

            if (request.ImageFile != null && request.ImageFile.Length > 0)
            {
                var cloudName = _configuration["Cloudinary:CloudName"];
                var apiKey = _configuration["Cloudinary:ApiKey"];
                var apiSecret = _configuration["Cloudinary:ApiSecret"];

                var account = new Account(cloudName, apiKey, apiSecret);
                var cloudinary = new Cloudinary(account);
                using var stream = request.ImageFile.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(request.ImageFile.FileName, stream),
                    Folder = "products"
                };
                var uploadResult = await cloudinary.UploadAsync(uploadParams);
                product.ImageUrl = uploadResult.SecureUrl.ToString();
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.TechnicalSpecs = request.TechnicalSpecs;
            product.AgeRange = request.AgeRange;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;

            _context.Products.Update(product);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return new ApiResponse<ProductResponse>
                {
                    Success = false,
                    Message = "CategoryId hoặc BrandId không tồn tại."
                };
            }

            await _context.Entry(product).Reference(p => p.Category).LoadAsync();
            await _context.Entry(product).Reference(p => p.Brand).LoadAsync();

            var dto = new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                TechnicalSpecs = product.TechnicalSpecs,
                AgeRange = product.AgeRange,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.CategoryName,
                BrandId = product.BrandId,
                BrandName = product.Brand?.BrandName
            };

            return new ApiResponse<ProductResponse>
            {
                Success = true,
                Message = "Cập nhật thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return new ApiResponse<bool> { Success = false, Message = "Product not found" };
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Xóa thành công",
                    Data = true
                };
            }
            catch (DbUpdateException ex)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Không thể xóa sản phẩm này vì đang có dữ liệu liên quan (ví dụ: Chi tiết đơn hàng, ...)."
                };
            }
        }
    }
}
