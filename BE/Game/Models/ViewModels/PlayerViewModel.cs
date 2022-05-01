using Data.Enums;
using Game.Entities;

namespace Game.Models.ViewModels {
  public class PlayerViewModel {
    public string Username { get; set; }
    public bool CalledLastCard { get; set; }
    public bool CouldLayDrawFourCard { get; set; }
    public bool CouldLayDrawTwoCard { get; set; }
    public CardViewModel TakenLayableCard { get; set; }
    public int Points { get; set; }
    public int CardsCount { get; set; }

    public PlayerViewModel(Player player) {
      if (player is null) {
        return;
      }

      Username = player.Username;
      Points = player.Points;
      CardsCount = player.Cards.Count();
      CalledLastCard = player.CalledLastCard;
      CouldLayDrawFourCard = player.CouldLayDrawFourCard;
      CouldLayDrawTwoCard = player.CouldLayDrawTwoCard;
      TakenLayableCard = player.TokeLayableCard ? new CardViewModel(player.Cards.Last()) : null;
    }
  }
}
