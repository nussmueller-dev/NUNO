using NUNO_Backend.Database.Entities;

namespace NUNO_Backend.Helpers {
  public class CurrentUserHelper {
    public User CurrentUser { get; private set; } = null;

    public void SetCurrentUser(User user) {
      if (CurrentUser is null) {
        CurrentUser = user;
      }
    }
  }
}
