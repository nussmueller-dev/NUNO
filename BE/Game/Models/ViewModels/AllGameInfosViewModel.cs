using Game.Entities;
using Game.Enums;

namespace Game.Models.ViewModels {
  public class AllGameInfosViewModel {
    public RulesViewModel Rules { get; set; }
    public List<PlayerViewModel> Players { get; set; }
    public PlayerViewModel CurrentPlayer { get; set; }
    public CardViewModel CurrentCard { get; set; }
    public bool IsReverseDirection { get; set; }

    public PlayerViewModel SessionCreator { get; set; }
    public SessionState SessionState { get; set; }

    public List<CardViewModel> MyCards { get; set; }

    public AllGameInfosViewModel(Session session, Player mePlayer) {
      Rules = new RulesViewModel(session.Rules);
      Players = session.Players.Select(x => new PlayerViewModel(x)).ToList();
      CurrentPlayer = new PlayerViewModel(session.CurrentPlayer);
      CurrentCard = new CardViewModel(session.CurrentCard);
      IsReverseDirection = session.IsReversing;
      SessionState = session.State;
      SessionCreator = new PlayerViewModel(session.Creator);

      MyCards = mePlayer.Cards.Select(x => new CardViewModel(x)).ToList();
    }
  }
}
