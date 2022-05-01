using Data.Interfaces;
using Game.Entities;
using Game.Enums;
using Game.Hubs;
using Game.Models.ViewModels;
using Microsoft.AspNetCore.SignalR;

namespace Game.Logic {
  public class SessionLogic {
    private readonly IHubContext<PlayersHub> _playersHub;
    private readonly Random Random = new Random();
    private List<Session> Sessions = new List<Session>();

    public SessionLogic(IHubContext<PlayersHub> playerOrderHub) { 
      _playersHub = playerOrderHub;
    }

    #region - Public Methodes -

    public Session CreateSession(Rules rules, IUser creator) {
      var newSession = new Session();

      do {
        newSession.Id = Random.Next(10000, 99999);
      } while (Sessions.Any(x => x.Id == newSession.Id));

      newSession.Rules = rules;
      newSession.Players.Add(new Player(creator, true));

      Sessions.Add(newSession);
      return newSession;
    }

    public Session GetSession(int sessionId) {
      return Sessions.FirstOrDefault(x => x.Id == sessionId);
    }

    public bool JoinSession(int sessionId, IUser user) {
      var session = GetSession(sessionId);
      if (session is null 
        || !session.NewPlayersCanJoin 
        || session.Players.Any(x => x.Username == user.Username)
      ) {
        return false;
      }

      session.Players.Add(new Player(user));
      InformAboutPlayerOrderChanged(sessionId);

      return true;
    }

    public int? RemoveConnectionId(string connectionId) {
      var players = Sessions.SelectMany(x => x.Players).ToList();
      var player = players.FirstOrDefault(x => x.PlayerConnectionIds.Contains(connectionId));

      player?.PlayerConnectionIds.Remove(connectionId);

      return player is null ? null : Sessions.FirstOrDefault(x => x.Players.Any(y => y == player))?.Id;
    }

    public bool IsUserInSession(int sessionId, IUser user) {
      var session = GetSession(sessionId);
      if (session is null) {
        return false;
      }

      if (session.Players.Any(x => x.Username == user.Username)) {
        return true;
      }

      return false;
    }

    public bool IsUserCreatorFromSession(int sessionId, IUser user) {
      var session = GetSession(sessionId);
      if (session is null) {
        return false;
      }

      if (session.Players.Any(x => x.IsCreator && x.Username == user.Username)) {
        return true;
      }

      return false;
    }

    public List<Player> ReorderPlayers(int sessionId, List<string> playerNames) {
      var session = GetSession(sessionId);

      if (session is null || session.Players.Count != playerNames.Count) {
        return null;
      }

      if (!session.Players.All(x => playerNames.Any(y => x.Username == y ))) {
        return null;
      }

      var newPlayersList = playerNames.Select(x => session.Players.First(y => y.Username == x)).ToList();
      session.Players = newPlayersList;

      InformAboutPlayerOrderChanged(sessionId);

      return newPlayersList;
    }

    public bool KickPlayer(int sessionId, string username) {
      var session = GetSession(sessionId);

      if (session is null 
        || !session.Players.Any(x => x.Username == username) 
        || session.Creator?.Username == username
      ) {
        return false;
      }

      var player = session.Players.First(x => x.Username == username);
      session.Players.Remove(player);

      InformAboutKick(player);
      InformAboutPlayerOrderChanged(sessionId);

      CheckForPlayableSession(session);

      return true;
    }

    public bool Quit(int sessionId, string username) {
      var session = GetSession(sessionId);

      if (session is null || !session.Players.Any(x => x.Username == username)
      ) {
        return false;
      }

      var player = session.Players.First(x => x.Username == username);
      session.Players.Remove(player);

      if (session.Players.Count > 0) {
        if (player.IsCreator) {
          var newCreator = session.Players[0];
          newCreator.UpgradeToCreator();

          InformAboutUpgradeToCreator(newCreator);
        } 
        
        InformAboutPlayerOrderChanged(sessionId);
      } else {
        Sessions.Remove(session);
      }

      CheckForPlayableSession(session);

      return true;
    }

    #endregion

    #region - Private Methodes -

    private void InformAboutPlayerOrderChanged(int sessionId) {
      var session = GetSession(sessionId);

      if (session is null) {
        return;
      }

      var playerViewModels = session.Players.Select(x => new PlayerViewModel(x)).ToList();

      _playersHub.Clients.Group($"session-{sessionId}").SendAsync("reorder", playerViewModels);
    }

    private void CheckForPlayableSession(Session session) {
      if (session.State == SessionState.Play && session.Players.Count < 2) {
        session.State = SessionState.ManagePlayers;
        session.CanStarteGame = true;
        session.NewPlayersCanJoin = true;

        InformAboutGameCancelled(session);
      }
    }

    private void InformAboutKick(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("kick");
      }
    }

    private void InformAboutUpgradeToCreator(Player player) {
      foreach (var connectionId in player.PlayerConnectionIds) {
        _playersHub.Clients.Client(connectionId).SendAsync("youAreCreatorNow");
      }
    }

    private void InformAboutGameCancelled(Session session) {
      _playersHub.Clients.Group($"session-{session.Id}").SendAsync("gameCancelled");
    }

    #endregion

  }
}
