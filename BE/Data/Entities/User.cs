using Data.Enums;
using Data.Interfaces;

namespace Data.Entities {
  public class User : IUser {
    public int Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public RoleType Role { get; set; }
    public string Salt { get; set; }
    public string PasswordHash { get; set; }
  }
}
