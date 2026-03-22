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
    public class CategoryService : ICategoryService
    {
        private readonly STEM_Shop_DBContext _context;

        public CategoryService(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<CategoryResponse>>> GetAllCategoriesAsync()
        {
            var categories = await _context.Categories.ToListAsync();
            var dtos = categories.Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.CategoryName,
                Description = c.Description
            }).ToList();

            return new ApiResponse<List<CategoryResponse>>
            {
                Success = true,
                Message = "Lấy danh sách thành công",
                Data = dtos
            };
        }

        public async Task<ApiResponse<CategoryResponse>> GetCategoryByIdAsync(int id)
        {
            var c = await _context.Categories.FindAsync(id);
            if (c == null)
            {
                return new ApiResponse<CategoryResponse> { Success = false, Message = "Category not found" };
            }

            var dto = new CategoryResponse
            {
                Id = c.Id,
                Name = c.CategoryName,
                Description = c.Description
            };
            return new ApiResponse<CategoryResponse>
            {
                Success = true,
                Message = "Lấy thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<CategoryResponse>> CreateCategoryAsync(CreateCategoryRequest request)
        {
            var category = new Category
            {
                CategoryName = request.Name,
                Description = request.Description
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var dto = new CategoryResponse
            {
                Id = category.Id,
                Name = category.CategoryName,
                Description = category.Description
            };

            return new ApiResponse<CategoryResponse>
            {
                Success = true,
                Message = "Tạo thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<CategoryResponse>> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return new ApiResponse<CategoryResponse> { Success = false, Message = "Category not found" };
            }

            category.CategoryName = request.Name;
            category.Description = request.Description;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            var dto = new CategoryResponse
            {
                Id = category.Id,
                Name = category.CategoryName,
                Description = category.Description
            };

            return new ApiResponse<CategoryResponse>
            {
                Success = true,
                Message = "Cập nhật thành công",
                Data = dto
            };
        }

        public async Task<ApiResponse<bool>> DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return new ApiResponse<bool> { Success = false, Message = "Category not found" };
            }

            _context.Categories.Remove(category);
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
