using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Implementations
{
    public class WarehouseService : IWarehouseService
    {
        private readonly STEM_Shop_DBContext _context;
        public WarehouseService(STEM_Shop_DBContext context) { _context = context; }

        public async Task<bool> UpdateInventoryAsync(InventoryUpdateDTO model)
        {
            var strategy = _context.Database.CreateExecutionStrategy();
            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
            {
                // 1. Cập nhật WarehouseStocks (Số lượng tại kho cụ thể)
                var stock = await _context.WarehouseStocks
                    .FirstOrDefaultAsync(s => s.WarehouseId == model.WarehouseId && s.ProductId == model.ProductId);

                int change = model.Type.ToUpper() == "IN" ? model.Quantity : -model.Quantity;

                if (stock == null)
                {
                    _context.WarehouseStocks.Add(new WarehouseStock
                    {
                        WarehouseId = model.WarehouseId,
                        ProductId = model.ProductId,
                        Quantity = model.Quantity
                    });
                }
                else
                {
                    stock.Quantity += change;
                }

                // 2. Cập nhật Products.StockQuantity (Tổng tồn kho - như bạn thắc mắc)
                var product = await _context.Products.FindAsync(model.ProductId);
                if (product != null) product.StockQuantity += change;

                // 3. Ghi Log
                _context.InventoryLogs.Add(new InventoryLog
                {
                    WarehouseId = model.WarehouseId,
                    ProductId = model.ProductId,
                    Type = model.Type,
                    Quantity = model.Quantity,
                    LogDate = DateTime.Now
                });

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
            });
        }

        public async Task<IEnumerable<StockReportDTO>> GetLowStockAlertAsync(int threshold)
        {
            return await _context.Products
                .Where(p => p.StockQuantity < threshold)
                .Select(p => new StockReportDTO
                {
                    ProductName = p.Name,
                    TotalStock = p.StockQuantity ?? 0,
                    Status = "Sắp hết hàng"
                }).ToListAsync();
        }

        public async Task<object> GetStockDistributionAsync(int productId)
        {
            return await _context.WarehouseStocks
               .Where(s => s.ProductId == productId)
               .Select(s => new { s.Warehouse.WarehouseName, s.Quantity })
               .ToListAsync();
        }
    }
}
