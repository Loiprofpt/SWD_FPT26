using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using STEM_Shop.Data.Context;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Implementations;
using STEM_Shop.Services.Interfaces;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1. Add Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
       
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// 2. Config CORS (Cho phép Frontend gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(builder.Configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. Config Authentication (JWT)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "STEM_Shop",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "STEM_Shop_User",
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "SecretKeyDayLaKhoaBiMatCuaSTEMShop2024")),

        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    };
});

// 4. Config Swagger (OpenAPI) with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "STEM Shop API", Version = "v1" });

    // Cấu hình nút Authorize nhập Token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter your JWT Token",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Hiển thị comment XML trên Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

// 5. Register Services & DbContext
builder.Services.AddDbContext<STEM_Shop_DBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null
        )
    ));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();

var app = builder.Build();

// Data Seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<STEM_Shop_DBContext>();
        await DbSeeder.SeedAsync(context);
    }
    catch (System.Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Thêm dữ liệu mẫu vào DB bị lỗi.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // Luôn bật Swagger để dễ test
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();   
app.UseCors("AllowFrontend"); // Kích hoạt CORS
app.UseAuthentication(); // Nếu có cấu hình Auth
app.UseAuthorization();
app.MapControllers();

app.Run();
