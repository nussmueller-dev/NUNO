using Data.Interfaces;

namespace Game.Entities {
  public class Player {
    private IUser User { get; set; }
    public string Username { 
      get {
        return User.Username;  
      } 
    }
    public bool IsCreator { get; private set; }
    public int Points { get; set; }
    public List<Card> Cards { get; set; }
    public IList<string> PlayerConnectionIds { get; } = new List<string>();

    public Player(IUser user, bool isCreator = false) {
      User = user;
      IsCreator = isCreator;
    }

    public void UpgradeToCreator() {
      IsCreator = true;
    }
  }
}
