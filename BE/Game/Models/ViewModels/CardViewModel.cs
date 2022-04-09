using Game.Entities;
using Game.Enums;

namespace Game.Models.ViewModels {
  public class CardViewModel {
    public int Id { get; set; }
    public CardType CardType { get; set; }
    public ColorType? Color { get; set; }
    public int? Number { get; set; }

    public CardViewModel(Card card) { 
      Id = card.Id;
      CardType = card.CardType;
      Color = card.Color;
      Number = card.Number;
    }
  }
}
