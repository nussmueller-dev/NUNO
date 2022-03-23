using Data.Entities;
using Data.Enums;

namespace Authentication.Models.ViewModels {
  public class LoginViewModel {
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public RoleType Role { get; set; }
    public string Token { get; set; }

    public LoginViewModel(User user, string token, RoleType role) {
      Id = user.Id;
      Username = user.Username;
      Email = user.Email;
      Token = token;
      Role = role;
    }
  }
}
