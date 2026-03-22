using STEM_Shop.Services.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<List<UserResponse>>> GetAllUsersAsync();
        Task<ApiResponse<UserResponse>> GetUserByIdAsync(int id);
        Task<ApiResponse<UserResponse>> CreateUserAsync(CreateUserRequest request);
        Task<ApiResponse<UserResponse>> UpdateUserAsync(int id, UpdateUserRequest request);
        Task<ApiResponse<bool>> DeleteUserAsync(int id);
    }
}