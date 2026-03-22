using Microsoft.EntityFrameworkCore;
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

        public ProductService(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<ProductResponse>>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .ToListAsync();
                
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
            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                TechnicalSpecs = request.TechnicalSpecs,
                AgeRange = request.AgeRange,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                ImageUrl = request.ImageUrl,
                CategoryId = request.CategoryId,
                BrandId = request.BrandId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

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

            product.Name = request.Name;
            product.Description = request.Description;
            product.TechnicalSpecs = request.TechnicalSpecs;
            product.AgeRange = request.AgeRange;
            product.Price = request.Price;
            product.StockQuantity = request.StockQuantity;
            product.ImageUrl = request.ImageUrl;
            product.CategoryId = request.CategoryId;
            product.BrandId = request.BrandId;

            _context.Products.Update(product);
            await _context.SaveChangesAsync();

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
    }
}
