using NUNO_Backend.Database.Interfaces;

namespace NUNO_Backend.Database.Entities {
  public class TempUser : IUser {
    public int Id { get; set; }
    public string Username { get; set; }
    public string SessionId { get; set; }
    public DateTime LastLoginDate { get; set; } = DateTime.Now;
  }
}
