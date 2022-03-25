using Game.Interfaces.Entities;

namespace Game.Entities {
  public class Session {
    public int Id { get; set; }
    public IRules Rules { get; set; }
    public List<Player> Players { get; set; } = new List<Player> { };
    public List<ICard> CardStack { get; set; } = new List<ICard> { };
  }
}
