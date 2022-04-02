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
    public IList<string> ConnectionIds { get; } = new List<string>();
    public bool IsCreator { get; }
    public List<ICard> Cards { get; set; }

    public Player(IUser user, bool isCreator = false) {
      User = user;
      IsCreator = isCreator;
    }
  }
}
