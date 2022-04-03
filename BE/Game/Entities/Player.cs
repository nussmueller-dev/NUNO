using Data.Interfaces;
using Game.Interfaces.Entities;

namespace Game.Entities {
  public class Player {
    private IUser User { get; set; }
    public string Username { 
      get {
        return User.Username;  
      } 
    }
    public bool IsCreator { get; }
    public int Points { get; set; }
    public List<ICard> Cards { get; set; }
    public IList<string> PlayerConnectionIds { get; } = new List<string>();

    public Player(IUser user, bool isCreator = false) {
      User = user;
      IsCreator = isCreator;
    }
  }
}
