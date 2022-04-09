using Game.Enums;

namespace Game.Entities {
  public class Card {
    public int Id { get; }
    public CardType CardType { get; set; }
    public ColorType? Color { get; set; }
    public int? Number { get; set; }

    private static int lastCardId = 0;

    public Card(CardType cardType, ColorType? color = null, int? number = null) {
      Id = lastCardId + 1;
      lastCardId = Id;

      CardType = cardType;
      Color = color;
      Number = number;
    }
  }
}
