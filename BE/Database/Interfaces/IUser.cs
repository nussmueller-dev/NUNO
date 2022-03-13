using NUNO_Backend.Enums;

namespace NUNO_Backend.Database.Interfaces {
  public interface IUser {
    public string Username { get; set; }
    public RoleType Role { get; set; }
  }
}
