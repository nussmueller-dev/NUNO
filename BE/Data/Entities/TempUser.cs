using Data.Enums;
using Data.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities {
  public class TempUser : IUser {
    public int Id { get; set; }
    public string Username { get; set; }
    public string SessionId { get; set; }
    [NotMapped]
    public RoleType Role { get; } = RoleType.TempUser;
    public DateTime LastLoginDate { get; set; } = DateTime.Now;
  }
}
