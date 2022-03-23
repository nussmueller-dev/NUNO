using Data.Enums;

namespace Data.Interfaces {
  public interface IUser {
    public string Username { get; set; }
    public RoleType Role { get; }
  }
}
