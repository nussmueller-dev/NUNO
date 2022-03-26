using Game.Interfaces.Entities;

namespace Game.UNO.Entities {
  public class UnoRules : IRules {
    public int CardsetsCount { get; set; } = 2;
    public int StartCardCount { get; set; } = 7;

    public bool Mitigate { get; set; } = true;
    public bool Accumulate { get; set; } = true;
    public bool JumpIn { get; set; } = true;
    public bool Sleep { get; set; } = true;
    public bool SevenNull { get; set; } = true;
  }
}
