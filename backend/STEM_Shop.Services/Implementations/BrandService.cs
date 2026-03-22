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
    public class BrandService : IBrandService
    {
        private readonly STEM_Shop_DBContext _context;

        public BrandService(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<BrandResponse>>> GetAllBrandsAsync()
        {
            var brands = await _context.Brands.ToListAsync();
            var dtos = brands.Select(b => new BrandResponse
            {
                Id = b.Id,
                Name = b.BrandName,
                Description = b.Description
            }).ToList();

            return new ApiResponse<List<BrandResponse>>
            {
                Success = true,
                Message = "Lấy danh sách thành công",
                Data = dtos
            };
        }

        public async Task<ApiResponse<BrandResponse>> GetBrandByIdAsync(int id)
        {
            var b = await _context.Brands.FindAsync(id);
            if (b == null)
            {
                return new ApiResponse<BrandResponse> { Success = false, Message = "Brand not found" };
            }

            var dto = new BrandResponse
            {
                Id = b.Id,
                Name = b.BrandName,
                Description = b.Description
            };
            return new ApiResponse<BrandResponse>
            {
                Success = true,
                Message = "Lấy thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<BrandResponse>> CreateBrandAsync(CreateBrandRequest request)
        {
            var brand = new Brand
            {
                BrandName = request.Name,
                Description = request.Description
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            var dto = new BrandResponse
            {
                Id = brand.Id,
                Name = brand.BrandName,
                Description = brand.Description
            };

            return new ApiResponse<BrandResponse>
            {
                Success = true,
                Message = "Tạo thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<BrandResponse>> UpdateBrandAsync(int id, UpdateBrandRequest request)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return new ApiResponse<BrandResponse> { Success = false, Message = "Brand not found" };
            }

            brand.BrandName = request.Name;
            brand.Description = request.Description;

            _context.Brands.Update(brand);
            await _context.SaveChangesAsync();

            var dto = new BrandResponse
            {
                Id = brand.Id,
                Name = brand.BrandName,
                Description = brand.Description
            };

            return new ApiResponse<BrandResponse>
            {
                Success = true,
                Message = "Cập nhật thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<bool>> DeleteBrandAsync(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return new ApiResponse<bool> { Success = false, Message = "Brand not found" };
            }

            _context.Brands.Remove(brand);
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
