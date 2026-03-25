using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;

namespace STEM_Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController : Controller
    {
        private readonly IWarehouseService _warehouseService;
        private readonly STEM_Shop_DBContext _context;

        public WarehouseController(IWarehouseService warehouseService, STEM_Shop_DBContext context)
        {
            _warehouseService = warehouseService;
            _context = context;
        }

        // 1. Lấy danh sách tất cả các kho
        [HttpGet]
        public async Task<IActionResult> GetAllWarehouses()
        {
            var list = await _context.Warehouses
                .Include(w => w.WarehouseStocks)        
                    .ThenInclude(ws => ws.Product)        
                .ToListAsync();

            return Ok(list);
        }

        // 2. Tạo kho mới
        [HttpPost("create")]
        public async Task<IActionResult> CreateWarehouse(WarehouseDTO model)
        {
            var warehouse = new Warehouse
            {
                WarehouseName = model.WarehouseName,
                Location = model.Location
            };
            _context.Warehouses.Add(warehouse);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Tạo kho thành công" });
        }

        // 3. Nhập hàng vào kho (Tự động cộng vào Products.StockQuantity)
        [HttpPost("import")]
        public async Task<IActionResult> ImportStock(InventoryUpdateDTO model)
        {
            model.Type = "IN"; // Ép kiểu là Nhập
            var result = await _warehouseService.UpdateInventoryAsync(model);
            if (result) return Ok(new { message = "Nhập kho thành công, tổng tồn kho đã tăng." });
            return BadRequest("Lỗi nhập kho.");
        }
        // Trong WarehouseController.cs
        [HttpGet("stock-details/{productId}")]
        public async Task<IActionResult> GetProductStockDistribution(int productId)
        {
            var distribution = await _context.WarehouseStocks
                .Where(ws => ws.ProductId == productId)
                .Select(ws => new {
                    WarehouseName = ws.Warehouse.WarehouseName,
                    CurrentQuantity = ws.Quantity,
                    Location = ws.Warehouse.Location
                }).ToListAsync();

            return Ok(distribution);
        }
    }
}
