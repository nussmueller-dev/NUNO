using Game.Enums;

namespace Game.Entities {
  public class Card {
    public int Id { get; set; }
    public CardType CardType { get; set; }
    public ColorType Color { get; set; }
    public int Number { get; set; }
  }
}
