using NUNO_Backend.Database.Entities;
using System.IdentityModel.Tokens.Jwt;

namespace NUNO_Backend.Helpers {
  public class CurrentUserHelper {
    public User CurrentUser { get; private set; } = null;
    public JwtSecurityToken Token { get; private set; } = null;

    public void SetCurrentUser(User user) {
      if (CurrentUser is null) {
        CurrentUser = user;
      }
    }

    public void SetToken(JwtSecurityToken token) {
      if (Token is null) {
        Token = token;
      }
    }
  }
}
