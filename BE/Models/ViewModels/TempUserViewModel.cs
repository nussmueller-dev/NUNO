using NUNO_Backend.Enums;

namespace NUNO_Backend.Models.ViewModels {
  public class TempUserViewModel {
    public string SessionId { get; set; }
    public string Username { get; set; }
    public RoleType Role { get; set; }

    public TempUserViewModel(string sessionId, string username, RoleType role) { 
      SessionId = sessionId;
      Username = username;
      Role = role;
    }
  }
}
