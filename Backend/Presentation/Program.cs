using backend.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

using Microsoft.OpenApi.Models;
using System.Text;
using backend.Services.Ocr;
using backend.Services.Classification;

using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("AuthLimiter", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ip,
//            _ => ...

//تعني:

//"استقبل قيمة ما، لكنني لن أستخدمها."
            factory: _ => new FixedWindowRateLimiterOptions          
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            });
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
        Array.Empty<string>()
    }
});
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("BureauDorderApiCorsPolicy", policy =>
    {
        policy
            .WithOrigins(
                "https://localhost:7217",
                "http://localhost:5215",
                "http://localhost:8082",
                "http://localhost:8083",
                "http://localhost:8081"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ===============================
// JWT Authentication Configuration
// ===============================


// Register authentication services in the dependency injection container.
// JwtBearerDefaults.AuthenticationScheme tells ASP.NET Core that
// JWT Bearer authentication will be the default authentication method.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // TokenValidationParameters define how incoming JWTs will be validated.
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Ensures the token was issued by a trusted issuer.
            ValidateIssuer = true,


            // Ensures the token is intended for this API (audience check).
            ValidateAudience = true,


            // Ensures the token has not expired.
            ValidateLifetime = true,


            // Ensures the token signature is valid and was signed by the API.
            ValidateIssuerSigningKey = true,


            // The expected issuer value (must match the issuer used when creating the JWT).
            ValidIssuer = "BureauOrderArchiveAPI",


            // The expected audience value (must match the audience used when creating the JWT).
            ValidAudience = "BureauOrderArchiveAPIUsers",

            // The secret key used to validate the JWT signature.
            // This must be the same key used when generating the token.
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("THIS_IS_A_VERY_SECRET_KEY_123456"))
        };
    });



// ===============================
// 2) Authorization (Updated)
// ===============================
//
// This enables authorization features such as:
// - [Authorize]
// - [Authorize(Roles="Admin")]
// - [Authorize(Policy="UserOwnerOrAdmin")]
builder.Services.AddAuthorization(options =>
{
    // Ownership policy: user can access only their own record, Admin can access any record.
    options.AddPolicy("UserOwnerOrAdmin", policy =>
        policy.Requirements.Add(new UserOwnerOrAdminRequirement()));

    options.AddPolicy("CourrierOwnerOrAdmin", policy =>
    policy.Requirements.Add(new CourrierOwnerOrAdminRequirement()));

});

// Register the policy handler that contains the ownership logic.
builder.Services.AddSingleton<IAuthorizationHandler, UserOwnerOrAdminHandler>();
builder.Services.AddSingleton<IAuthorizationHandler, CourrierOwnerOrAdminHandler>();

builder.Services.AddScoped<IOcrService, TesseractOcrService>();
builder.Services.AddScoped<IOcrClassificationService, RuleBasedOcrClassificationService>();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("BureauDorderApiCorsPolicy");

app.UseRateLimiter();      // ✅ before auth

app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == StatusCodes.Status429TooManyRequests)
    {
        await context.Response.WriteAsync("Too many login attempts. Please try again later.");
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }

