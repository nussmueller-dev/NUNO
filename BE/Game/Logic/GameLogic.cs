using Game.Entities;
using Game.Enums;
using Game.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Game.Logic {
  public class GameLogic {
    private readonly SessionLogic _sessionLogic;
    private readonly IHubContext<PlayersHub> _playersHub;
    private readonly Random _random = new Random();

    public GameLogic(SessionLogic sessionLogic, IHubContext<PlayersHub> playerOrderHub) {
      _sessionLogic = sessionLogic;
      _playersHub = playerOrderHub;
    }

    #region - Public Methodes -

    public bool StartGame(int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);

      if (session is null
        || session.Players.Count < 2
      ) {
        return false;
      }

      session.NewPlayersCanJoin = false;
      session.CardStack = GenerateCardStack();

      foreach (var player in session.Players) {
        player.Cards.Clear();

        for (int i = 0; i < session.Rules.StartCardCount; i++) {
          player.Cards.Add(TakeRandomCardFromStack(session));
        }
      }

      return true;
    }

    #endregion

    #region - Private Methodes -

    private List<Card> GenerateCardStack() {
      var newCardStack = new List<Card>();

      for (int i = 1; i <= 2; i++) {
        var colors = Enum.GetValues(typeof(ColorType)).Cast<ColorType>();

        foreach (var color in colors) {
          for (int j = 0; j <= 9; j++) {
            if (j != 0 || i % 2 == 0) {
              newCardStack.Add(new Card(CardType.Number, color, j));
            }
          }

          newCardStack.Add(new Card(CardType.Skip, color));
          newCardStack.Add(new Card(CardType.Reverse, color));
          newCardStack.Add(new Card(CardType.DrawTwo, color));
        }

        for (int j = 1; j <= 4; j++) {
          if (j % 2 == 0) {
            newCardStack.Add(new Card(CardType.WildDrawFour));
          }

          newCardStack.Add(new Card(CardType.Wild));
        }
      }

      return newCardStack;
    }

    private Card TakeRandomCardFromStack(Session session) {
      var randomcardIndex = _random.Next(session.CardStack.Count);
      var randomCard = session.CardStack[randomcardIndex];

      session.CardStack.Remove(randomCard);

      if (session.CardStack.Count == 0) {
        session.CardStack = session.LaidCards;
        session.LaidCards = new List<Card>();
      }

      if (session.CardStack.Count == 0) {
        session.CardStack = GenerateCardStack();
      }

      return randomCard;
    }

    private void InformAboutGameStart(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("gameStarts");
    }

    #endregion

  }
}
