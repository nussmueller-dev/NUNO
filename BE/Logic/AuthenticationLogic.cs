using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using NUNO_Backend.Database;
using NUNO_Backend.Database.Entities;
using NUNO_Backend.Helpers;
using NUNO_Backend.Models.BindingModels;
using NUNO_Backend.Models.ViewModels;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using NUNO_Backend.Enums;

namespace NUNO_Backend.Logic {
  public class AuthenticationLogic {
    private const double EXPIRY_DURATION_HOURS = 12;

    private readonly IConfiguration _configuration;
    private readonly NunoDbContext _dbContext;
    private readonly CurrentUserHelper _currentUserHelper;

    public AuthenticationLogic(IConfiguration configuration, NunoDbContext dbContext, CurrentUserHelper currentUserHelper) {
      _configuration = configuration;
      _dbContext = dbContext;
      _currentUserHelper = currentUserHelper;
    }

    public LoginViewModel Login(LoginBindingModel model) {
      User user = _dbContext.Users.FirstOrDefault(x => x.Username == model.Username || x.Email == model.Username);

      if (user is null || !CheckPassword(user, model.Password)) return null;

      var token = BuildToken(user);

      return new LoginViewModel(user, token);
    }

    public User Register(RegisterBindingModel registerModel) {
      var user = new User();

      user.Email = registerModel.Email;
      user.Username = registerModel.Username;

      user.Salt = GetSalt();
      user.PasswordHash = HashPassword(registerModel.Password, user.Salt);
      user.Role = RoleType.Player;

      _dbContext.Users.Add(user);
      _dbContext.SaveChanges();

      return user;
    }

    public LoginViewModel GetUserInformations(User user = null) {
      user = user ?? _currentUserHelper.CurrentUser;

      var token = BuildToken(user);

      return new LoginViewModel(user, token);
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
      var user = _dbContext.Users.FirstOrDefault(x => x.Username == username);

      if (user != null) {
        _currentUserHelper.SetToken(securityToken);
      }

      return user;
    }

    public bool CheckPassword(User user, string password) {
      return user.PasswordHash == HashPassword(password, user.Salt);
    }

    private string BuildToken(User user) {
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

    private string HashPassword(string password, string salt) {
      var hashedPassword = KeyDerivation.Pbkdf2(
          password: password,
          salt: Convert.FromBase64String(salt),
          prf: KeyDerivationPrf.HMACSHA256,
          iterationCount: 100000,
          numBytesRequested: 256 / 8);

      return Convert.ToBase64String(hashedPassword);
    }

    private string GetSalt() {
      byte[] salt;
      do {
        salt = RandomNumberGenerator.GetBytes(128 / 8);
      } while (salt.Any(x => x == 0));

      return Convert.ToBase64String(salt);
    }
  }
}
