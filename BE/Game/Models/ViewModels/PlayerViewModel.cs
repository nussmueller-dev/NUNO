using Data.Enums;
using Game.Entities;

namespace Game.Models.ViewModels {
  public class PlayerViewModel {
    public string Username { get; set; }
    public bool CalledLastCard { get; set; }
    public int Points { get; set; }
    public int CardsCount { get; set; }

    public PlayerViewModel(Player player) { 
      Username = player.Username;
      Points = player.Points;
      CardsCount = player.Cards.Count();
      CalledLastCard = player.CalledLastCard;
    }
  }
}
