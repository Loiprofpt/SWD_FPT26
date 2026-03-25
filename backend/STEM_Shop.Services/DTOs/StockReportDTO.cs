using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace STEM_Shop.Services.DTOs
{
    public class StockReportDTO
    {
        public string ProductName { get; set; }
        public int TotalStock { get; set; }
        public string Status { get; set; }
    }
}
