using Game.Entities;

namespace Game.Models.ViewModels {
  public class AllGameInfosViewModel {
    public List<PlayerViewModel> Players { get; set; }
    public PlayerViewModel CurrentPlayer { get; set; }
    public CardViewModel CurrentCard { get; set; }
    public bool IsReverseDirection { get; set; }

    public List<CardViewModel> MyCards { get; set; }

    public AllGameInfosViewModel(Session session, Player mePlayer) {
      Players = session.Players.Select(x => new PlayerViewModel(x)).ToList();
      CurrentPlayer = new PlayerViewModel(session.CurrentPlayer);
      CurrentCard = new CardViewModel(session.CurrentCard);
      IsReverseDirection = session.IsReversing;

      MyCards = mePlayer.Cards.Select(x => new CardViewModel(x)).ToList();
    }
  }
}
