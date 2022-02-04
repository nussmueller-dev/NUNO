using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NUNO_Backend.Database;
using NUNO_Backend.Helpers;
using NUNO_Backend.Logic;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#if (DEBUG)
  var connectionString = builder.Configuration.GetConnectionString("DebugConnection");
#else
  var connectionString = builder.Configuration.GetConnectionString("ServerConnection");
#endif

builder.Services.AddDbContextPool<NunoDbContext>(options =>
  options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => {
  options.TokenValidationParameters = new TokenValidationParameters {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    ValidAudience = builder.Configuration["Jwt:Issuer"],
    IssuerSigningKey = new
      SymmetricSecurityKey
      (Encoding.UTF8.GetBytes
      (builder.Configuration["Jwt:Key"]))
  };
});

builder.Services.AddScoped<AuthenticationLogic>();
builder.Services.AddScoped<CurrentUserHelper>();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
