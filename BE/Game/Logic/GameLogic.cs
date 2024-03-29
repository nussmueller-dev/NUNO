﻿using Authentication.Helpers;
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
        || !session.CanStarteGame
      ) {
        return false;
      }

      session.NewPlayersCanJoin = false;
      session.CanStarteGame = false;
      session.CardStack = GenerateCardStack();
      session.LaidCards = new List<Card>();
      session.IsReversing = false;
      session.AccumulateCardsDrawFour = 0;
      session.AccumulateCardsDrawTwo = 0;

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

      session.CurrentPlayer = session.Players.First();
      session.State = SessionState.Play;

      InformAboutGameStart(session);
      InformAboutPlayersInfo(session);
      InformAboutCurrentPlayerChanged(session);

      return true;
    }

    public List<Card> LayCard(int sessionId, int cardId, ColorType? selectedColor) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentPlayer = GetCurrentPlayer(session);
      var card = currentPlayer?.Cards.FirstOrDefault(x => x.Id == cardId);
      var isLayInMove = currentPlayer != session.CurrentPlayer;

      if (session is null || currentPlayer is null || card is null || session.State != SessionState.Play) {
        return null;
      }

      if (card.CardType == CardType.Wild || card.CardType == CardType.WildDrawFour) {
        if (selectedColor is null) {
          return null;
        } else {
          card.Color = selectedColor;
        }
      }

      if (currentPlayer != session.CurrentPlayer && (!session.Rules.JumpIn || !IsSameCard(card, session.CurrentCard))) {
        return null;
      }

      if ((currentPlayer.CouldLayDrawTwoCard && card.CardType != CardType.DrawTwo) || (currentPlayer.CouldLayDrawFourCard && card.CardType != CardType.WildDrawFour)) {
        return null;
      }

      if (!CanLayCard(session, card)) {
        return null;
      }

      if (isLayInMove) {
        session.CurrentPlayer.CouldLayDrawFourCard = false;
        session.CurrentPlayer.CouldLayDrawTwoCard = false;
        session.CurrentPlayer.TokeLayableCard = false;

        session.CurrentPlayer = currentPlayer;
      }

      CheckForLastCardCalls(session);
      currentPlayer.CalledLastCard = false;

      currentPlayer.TokeLayableCard = false;
      currentPlayer.CouldLayDrawFourCard = false;
      currentPlayer.CouldLayDrawTwoCard = false;

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

      if (session.Players.Any(x => x.Cards.Count == 0)) {
        EndGame(session);
      }

      InformAboutNewCurrentCard(session);
      InformAboutPlayersInfo(session);
      InformAboutCurrentPlayerChanged(session);

      return currentPlayer.Cards;
    }

    public bool DontWantToLayCard(int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentPlayer = GetCurrentPlayer(session);

      if (session is null 
        || currentPlayer is null 
        || session.CurrentPlayer != currentPlayer 
        || (!currentPlayer.TokeLayableCard && !currentPlayer.CouldLayDrawTwoCard && !currentPlayer.CouldLayDrawFourCard)) {
        return false;
      }

      if (currentPlayer.CouldLayDrawTwoCard) {
        for (int i = 0; i < session.AccumulateCardsDrawTwo; i++) {
          currentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }

        session.AccumulateCardsDrawTwo = 0;

        InformAboutMyCardsChanged(currentPlayer);
      }

      if (currentPlayer.CouldLayDrawFourCard) {
        for (int i = 0; i < session.AccumulateCardsDrawFour; i++) {
          currentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }

        session.AccumulateCardsDrawFour = 0;

        InformAboutMyCardsChanged(currentPlayer);
      }

      if (currentPlayer.TokeLayableCard) {
        session.CurrentPlayer = GetNextPlayer(session);
        InformAboutCurrentPlayerChanged(session);
      }

      currentPlayer.TokeLayableCard = false;
      currentPlayer.CouldLayDrawTwoCard = false;
      currentPlayer.CouldLayDrawFourCard = false;

      return true;
    }

    public Card TakeCard(int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentPlayer = GetCurrentPlayer(session);

      if (session is null || currentPlayer is null) {
        return null;
      }

      if (session.CurrentPlayer != currentPlayer) {
        return null;
      }

      var newCard = TakeRandomCardFromStack(session);
      currentPlayer.Cards.Add(newCard);
      currentPlayer.TokeLayableCard = false;

      if (CanLayCard(session, newCard)) {
        currentPlayer.TokeLayableCard = true;
        InformAboutNewCardIsLayable(currentPlayer, newCard);
      } else {
        session.CurrentPlayer = GetNextPlayer(session);
        InformAboutCurrentPlayerChanged(session);
      }

      CheckForLastCardCalls(session);

      InformAboutMyCardsChanged(currentPlayer);
      InformAboutPlayersInfo(session);

      return newCard;
    }

    public bool CallLastCard(int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentPlayer = GetCurrentPlayer(session);

      if (session is null || currentPlayer is null || currentPlayer.Cards.Count != 1 || currentPlayer.CalledLastCard) {
        return false;
      }

      currentPlayer.CalledLastCard = true;

      InformAboutLastCard(session, currentPlayer);
      InformAboutPlayersInfo(session);

      return true;
    }

    public AllGameInfosViewModel GetAllInfos(int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentPlayer = GetCurrentPlayer(session);

      if (session is null || currentPlayer is null) {
        return null;
      }

      var viewModel = new AllGameInfosViewModel(session, currentPlayer);
      return viewModel;
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

    private void CheckForLastCardCalls(Session session) {
      foreach (var player in session.Players) {
        if (player.Cards.Count == 1 && !player.CalledLastCard) {
          for (int i = 0; i < 2; i++) {
            player.Cards.Add(TakeRandomCardFromStack(session));
          }

          InformAboutForgotCallLastCard(player);
          InformAboutMyCardsChanged(player);
        }
      }
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

    private void EndGame(Session session) {
      var winner = session.Players.FirstOrDefault(x => x.Cards.Count == 0);

      if (winner is null) {
        return;
      }

      foreach (var player in session.Players) {
        var points = player.Cards.Sum(x => GetPointsForCard(x));
        winner.Points += points;
      }

      session.State = SessionState.ShowResults;
      session.CanStarteGame = true;
      session.NewPlayersCanJoin = true;
      InformAboutGameEnd(session, winner);
    }

    private int GetPointsForCard(Card card) {
      switch (card.CardType) { 
        case CardType.Number:
          return card.Number ?? 0;
        case CardType.DrawTwo:
        case CardType.Reverse:
        case CardType.Skip:
          return 20;
        case CardType.Wild:
        case CardType.WildDrawFour:
          return 50;
        default:
          return 0;
      }
    }

    private bool IsSameCard(Card card1, Card card2) {
      if (card1.CardType != card2.CardType) {
        return false;
      }

      if (card1.CardType == CardType.Wild 
        || card1.CardType == CardType.WildDrawFour
       ) {
        return true;
      }

      if (card1.Color != card2.Color) {
        return false;
      }

      if (card1.CardType == CardType.Reverse 
        || card1.CardType == CardType.Skip
        || card1.CardType == CardType.DrawTwo  
      ) {
        return true;
      }

      if (card1.CardType == CardType.Number) {
        return card1.Number == card2.Number;
      }

      return false;
    }

    #region - Special Cards -

    private void WildDrawFour(Session session) {
      if (session.Rules.Accumulate && session.CurrentPlayer.Cards.Any(x => x.CardType == CardType.WildDrawFour)) {
        session.AccumulateCardsDrawFour += 4;
        session.CurrentPlayer.CouldLayDrawFourCard = true;

        InformAboutCouldLayDrawFour(session.CurrentPlayer);
      } else {
        for (int i = 0; i < 4; i++) {
          session.CurrentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }

        for (int i = 0; i < session.AccumulateCardsDrawFour; i++) {
          session.CurrentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }

        session.AccumulateCardsDrawFour = 0;

        InformAboutMyCardsChanged(session.CurrentPlayer);
      }
    }

    private void DrawTwo(Session session) {
      if (session.Rules.Accumulate && session.CurrentPlayer.Cards.Any(x => x.CardType == CardType.DrawTwo)) {
        session.AccumulateCardsDrawTwo += 2;
        session.CurrentPlayer.CouldLayDrawTwoCard = true;

        InformAboutCouldLayDrawTwo(session.CurrentPlayer);
      } else {
        for (int i = 0; i < 2; i++) {
          session.CurrentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }

        for (int i = 0; i < session.AccumulateCardsDrawTwo; i++) {
          session.CurrentPlayer.Cards.Add(TakeRandomCardFromStack(session));
        }

        session.AccumulateCardsDrawTwo = 0;

        InformAboutMyCardsChanged(session.CurrentPlayer);
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

    private void InformAboutGameEnd(Session session, Player winner) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("gotWinner", new PlayerViewModel(winner));
    }

    private void InformAboutNewCurrentCard(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("newCurrentCard", new CardViewModel(session.CurrentCard));
    }

    private void InformAboutReverse(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("reverse", session.IsReversing);
    }

    private void InformAboutPlayersInfo(Session session) {
      var playerViewModels = session.Players.Select(x => new PlayerViewModel(x)).ToList();

      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("players-info", playerViewModels);
    }

    private void InformAboutCurrentPlayerChanged(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("currentPlayerChanged", new PlayerViewModel(session.CurrentPlayer));
    }

    private void InformAboutLastCard(Session session, Player player) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("playerCalledLastCard", new PlayerViewModel(player));
    }

    private void InformAboutGotSkipped(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("youGotSkipped");
      }
    }

    private void InformAboutMyCardsChanged(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        var cardViewModels = player.Cards.Select(x => new CardViewModel(x)).ToList();

        _playersHub.Clients.Client(connectionId).SendAsync("myCardsChanged", cardViewModels);
      }
    }

    private void InformAboutForgotCallLastCard(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("forgotLastCardCall");
      }
    }

    private void InformAboutNewCardIsLayable(Player player, Card card) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("newCardIsLayable", new CardViewModel(card));
      }
    }

    private void InformAboutCouldLayDrawTwo(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("couldLayDrawTwo");
      }
    }

    private void InformAboutCouldLayDrawFour(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("couldLayDrawFour");
      }
    }

    #endregion

    #endregion

  }
}
