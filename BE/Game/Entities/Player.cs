using Data.Entities;
using Game.Interfaces.Entities;

namespace Game.Entities {
  public class Player {
    private User User { get; set; }
    public string Username { 
      get {
        return User.Username;  
      } 
    }
    public bool IsCreator { get; }
    public List<ICard> Cards { get; set; }

    public Player(User user, bool isCreator = false) {
      User = user;
      IsCreator = isCreator;
    }
  }
}
