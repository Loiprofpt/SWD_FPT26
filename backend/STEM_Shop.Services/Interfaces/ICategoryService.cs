using STEM_Shop.Services.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<List<CategoryResponse>>> GetAllCategoriesAsync();
        Task<ApiResponse<CategoryResponse>> GetCategoryByIdAsync(int id);
        Task<ApiResponse<CategoryResponse>> CreateCategoryAsync(CreateCategoryRequest request);
        Task<ApiResponse<CategoryResponse>> UpdateCategoryAsync(int id, UpdateCategoryRequest request);
        Task<ApiResponse<bool>> DeleteCategoryAsync(int id);
    }
}
