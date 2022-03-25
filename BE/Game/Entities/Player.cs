using Data.Entities;
using Game.Interfaces.Entities;

namespace Game.Entities {
  public class Player {
    public int UserId { get; }
    public string UserName { get; }
    public bool IsCreator { get; }
    public List<ICard> Cards { get; set; }

    public Player(User user, bool isCreator = false) {
      UserId = user.Id;
      UserName = user.Username;
      IsCreator = isCreator;
    }
  }
}
