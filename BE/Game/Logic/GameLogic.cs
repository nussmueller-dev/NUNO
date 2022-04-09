using Authentication.Helpers;
using Game.Entities;
using Game.Enums;
using Game.Hubs;
using Game.Models.ViewModels;
using Microsoft.AspNetCore.SignalR;

namespace Game.Logic {
  public class GameLogic {
    private readonly SessionLogic _sessionLogic;
    private readonly CurrentUserHelper _currentUserHelper;
    private readonly IHubContext<PlayersHub> _playersHub;
    private readonly Random _random = new Random();

    public GameLogic(SessionLogic sessionLogic, CurrentUserHelper currentUserHelper, IHubContext<PlayersHub> playerOrderHub) {
      _sessionLogic = sessionLogic;
      _playersHub = playerOrderHub;
      _currentUserHelper = currentUserHelper;
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
      session.LaidCards = new List<Card>();
      session.IsReversing = false;

      foreach (var player in session.Players) {
        player.Cards.Clear();

        for (int i = 0; i < session.Rules.StartCardCount; i++) {
          player.Cards.Add(TakeRandomCardFromStack(session));
        }
      }

      session.CurrentCard = TakeRandomCardFromStack(session);
      while (session.CurrentCard.CardType != CardType.Number) {
        session.LaidCards.Add(session.CurrentCard);
        session.CurrentCard = TakeRandomCardFromStack(session);
      }

      InformAboutGameStart(session);

      return true;
    }

    public List<Card> LayCard(int sessionId, int cardId, ColorType? selectedColor) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentPlayer = GetCurrentPlayer(session);
      var card = currentPlayer?.Cards.FirstOrDefault(x => x.Id == cardId);

      if (session is null || currentPlayer is null || card is null) {
        return null;
      }

      if (currentPlayer != session.CurrentPlayer) {
        return null;
      }

      if (card.CardType == CardType.Wild || card.CardType == CardType.WildDrawFour) {
        if (selectedColor is null) {
          return null;
        } else {
          card.Color = selectedColor;
        }
      }

      if (!CanLayCard(session, card)) {
        return null;
      }

      session.LaidCards.Add(session.CurrentCard);
      session.CurrentCard = card;
      currentPlayer.Cards.Remove(card);

      session.CurrentPlayer = GetNextPlayer(session);

      switch (card.CardType) {
        case CardType.Skip:
          Skip(session);
          break;
        case CardType.Reverse:
          Reverse(session);
          break;
        case CardType.WildDrawFour:
          WildDrawFour(session);
          break;
        case CardType.DrawTwo:
          DrawTwo(session);
          break;
      }

      InformAboutNewCurrentCard(session);

      return currentPlayer.Cards;
    }

    #endregion

    #region - Private Methodes -

    private bool CanLayCard(Session session, Card card) {
      if (card.CardType == CardType.Wild || card.CardType == CardType.WildDrawFour) {
        return true;
      }

      if (card.Color == session.CurrentCard.Color) {
        return true;
      }

      if (card.CardType == CardType.Number) {
        return card.Number == session.CurrentCard.Number;
      }

      if (card.CardType == session.CurrentCard.CardType) {
        return true;
      }

      return false;
    }

    private Player GetCurrentPlayer(Session session) {
      if (session is null) {
        return null;
      }

      var currentUser = _currentUserHelper.CurrentUser;
      return session.Players.FirstOrDefault(x => x.Username == currentUser.Username);
    }

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
        session.CardStack = ResetWildCards(session.LaidCards);
        session.LaidCards = new List<Card>();
      }

      if (session.CardStack.Count == 0) {
        session.CardStack = GenerateCardStack();
      }

      return randomCard;
    }

    private List<Card> ResetWildCards(List<Card> cards) {
      var wildCards = cards.Where(x => x.CardType == CardType.Wild || x.CardType == CardType.WildDrawFour);

      foreach (var wildCard in wildCards) {
        wildCard.Color = null;
      }

      return cards;
    }

    private Player GetNextPlayer(Session session) {
      var currentPlayerIndex = session.Players.IndexOf(session.CurrentPlayer);

      if (session.IsReversing) {
        if (currentPlayerIndex == 0) {
          return session.Players.Last();
        } else {
          return session.Players[currentPlayerIndex - 1];
        }
      } else {
        if (currentPlayerIndex == session.Players.Count - 1) {
          return session.Players.First();
        } else {
          return session.Players[currentPlayerIndex + 1];
        }
      }
    }

    #region - Special Cards -

    private void WildDrawFour(Session session) {
      if (session.Rules.Accumulate) {
        session.AccumulateCardsDrawFour += 4;
      } else {
        for (int i = 0; i < 4; i++) {
          session.CurrentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }
      }
    }

    private void DrawTwo(Session session) {
      if (session.Rules.Accumulate) {
        session.AccumulateCardsDrawTwo += 2;
      } else {
        for (int i = 0; i < 2; i++) {
          session.CurrentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }
      }
    }

    private void Reverse(Session session) {
      session.IsReversing = !session.IsReversing;
      session.CurrentPlayer = GetNextPlayer(session);
      session.CurrentPlayer = GetNextPlayer(session);

      InformAboutReverse(session);
    }

    private void Skip(Session session) {
      InformAboutGotSkipped(session.CurrentPlayer);
      session.CurrentPlayer = GetNextPlayer(session);
    }

    #endregion

    #region - Inform -

    private void InformAboutGameStart(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("gameStarts");
    }

    private void InformAboutGameEnd(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("gameEnds");
    }

    private void InformAboutNewCurrentCard(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("currentCard", new CardViewModel(session.CurrentCard));
    }

    private void InformAboutReverse(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("reverse", session.IsReversing);
    }

    private void InformAboutGotSkipped(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("youGotSkipped");
      }
    }

    #endregion

    #endregion

  }
}
