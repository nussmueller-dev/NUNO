namespace NUNO_Backend.Models.ViewModels {
  public class TempUserViewModel {
    public string SessionId { get; set; }
    public string Username { get; set; }

    public TempUserViewModel(string sessionId, string username) { 
      SessionId = sessionId;
      Username = username;
    }
  }
}
