using Microsoft.IdentityModel.Tokens;
using NUNO_Backend.Database;
using NUNO_Backend.Database.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NUNO_Backend.Logic {
  public class AuthenticationLogic {
    private const double EXPIRY_DURATION_HOURS = 12;

    private readonly IConfiguration _configuration;
    private readonly NunoDbContext _dbContext;

    public AuthenticationLogic(IConfiguration configuration, NunoDbContext dbContext) {
      _configuration = configuration;
      _dbContext = dbContext;
    }

    public string BuildToken(User user) {
      var key = _configuration["Jwt:Key"];
      var issuer = _configuration["Jwt:Issuer"];

      var claims = new[] {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };

      var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
      var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
      var tokenDescriptor = new JwtSecurityToken(issuer, issuer, claims,
          expires: DateTime.Now.AddHours(EXPIRY_DURATION_HOURS), signingCredentials: credentials);

      return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public User GetUserFromToken(string token) {
      var tokenHandler = new JwtSecurityTokenHandler();
      var tokenValidationParameters = GetTokenValidationParameters();

      if (token is null || token.Length == 0) {
        return null;
      }

      try {
        tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);
      } catch {
        return null;
      }

      var securityToken = (JwtSecurityToken)tokenHandler.ReadToken(token);
      var username = securityToken.Claims.First(x => x.Type == ClaimTypes.Name).Value;

      return _dbContext.Users.FirstOrDefault(x => x.Username == username);
    }

    private TokenValidationParameters GetTokenValidationParameters() {
      var key = _configuration["Jwt:Key"];
      var issuer = _configuration["Jwt:Issuer"];

      var secret = Encoding.UTF8.GetBytes(key);
      var securityKey = new SymmetricSecurityKey(secret);

      return new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = issuer,
        ValidAudience = issuer,
        IssuerSigningKey = securityKey,
      };
    }
  }
}
