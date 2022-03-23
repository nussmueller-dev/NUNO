using Authentication.Helpers;
using Authentication.Logic;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;

namespace NUNO_Backend.Extensions {
  public static class AuthenticationExtension {
    public static void AddAuthenticationProject(this WebApplicationBuilder builder) {
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

      builder.Services.AddScoped<CurrentUserHelper>();
      builder.Services.AddScoped<AuthenticationLogic>();
      builder.Services.AddScoped<TempUserLogic>();
    }
  }
}
