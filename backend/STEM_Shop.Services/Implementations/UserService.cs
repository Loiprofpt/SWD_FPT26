using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly STEM_Shop_DBContext _context;

        public UserService(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<UserResponse>>> GetAllUsersAsync()
        {
            var users = await _context.Users.Include(u => u.Role).ToListAsync();
            var userDtos = users.Select(u => new UserResponse
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role?.RoleName ?? "Unknown",
                CreatedAt = u.CreatedAt,
                IsBlocked = u.IsBlocked
            }).ToList();

            return new ApiResponse<List<UserResponse>>
            {
                Success = true,
                Message = "Lấy danh sách người dùng thành công",
                Data = userDtos
            };
        }

        public async Task<ApiResponse<UserResponse>> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return new ApiResponse<UserResponse> { Success = false, Message = "Không tìm thấy người dùng" };

            return new ApiResponse<UserResponse>
            {
                Success = true,
                Data = new UserResponse
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role?.RoleName,
                    CreatedAt = user.CreatedAt,
                    IsBlocked = user.IsBlocked
                }
            };
        }

        public async Task<ApiResponse<UserResponse>> CreateUserAsync(CreateUserRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return new ApiResponse<UserResponse> { Success = false, Message = "Email đã tồn tại" };
            }

            var newUser = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password, 
                PhoneNumber = request.PhoneNumber,
                RoleId = request.RoleId,
                CreatedAt = DateTime.Now,
                IsBlocked = 0
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            
            await _context.Entry(newUser).Reference(u => u.Role).LoadAsync();

            return new ApiResponse<UserResponse>
            {
                Success = true,
                Message = "Tạo người dùng thành công",
                Data = new UserResponse
                {
                    UserId = newUser.Id,
                    FullName = newUser.FullName,
                    Email = newUser.Email,
                    Role = newUser.Role?.RoleName,
                    CreatedAt = newUser.CreatedAt,
                    IsBlocked = newUser.IsBlocked
                }
            };
        }

        public async Task<ApiResponse<UserResponse>> UpdateUserAsync(int id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return new ApiResponse<UserResponse> { Success = false, Message = "Không tìm thấy người dùng" };

            user.FullName = request.FullName ?? user.FullName;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            
            if (request.RoleId.HasValue) user.RoleId = request.RoleId.Value;
            if (request.IsBlocked.HasValue) user.IsBlocked = request.IsBlocked.Value;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new ApiResponse<UserResponse> { Success = true, Message = "Cập nhật thành công", Data = null };
        }

        public async Task<ApiResponse<bool>> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return new ApiResponse<bool> { Success = false, Message = "Không tìm thấy người dùng" };

            user.IsBlocked = 1; // Soft Delete
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool> { Success = true, Message = "Đã khóa tài khoản người dùng thành công", Data = true };
        }
    }
}