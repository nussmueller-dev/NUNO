using NUNO_Backend.Database.Interfaces;
using NUNO_Backend.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace NUNO_Backend.Database.Entities {
  public class TempUser : IUser {
    public int Id { get; set; }
    public string Username { get; set; }
    public string SessionId { get; set; }
    [NotMapped]
    public RoleType Role { get; } = RoleType.TempUser;
    public DateTime LastLoginDate { get; set; } = DateTime.Now;
  }
}
