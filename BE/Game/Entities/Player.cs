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
    public bool CalledLastCard { get; set; } = false;
    public bool TokeLayableCard { get; set; } = false;
    public bool CouldLayDrawTwoCard { get; set; } = false;
    public bool CouldLayDrawFourCard { get; set; } = false;
    public int Points { get; set; } = 0;
    public List<Card> Cards { get; set; } = new List<Card>();
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
