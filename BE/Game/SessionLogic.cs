using Authentication.Helpers;
using Data.Interfaces;
using Game.Entities;
using Game.Hubs;
using Game.Interfaces.Entities;
using Microsoft.AspNetCore.SignalR;

namespace Game {
  public class SessionLogic {
    private readonly IHubContext<PlayerOrderHub> _playerOrderHub;
    private readonly Random Random = new Random();
    private List<Session> Sessions = new List<Session>();

    public SessionLogic(IHubContext<PlayerOrderHub> playerOrderHub) { 
      _playerOrderHub = playerOrderHub;
    }

    public Session CreateSession(IRules rules, IUser creator) {
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

    public void RemoveConnectionId(string connectionId) {
      var players = Sessions.SelectMany(x => x.Players).ToList();
      var player = players.FirstOrDefault(x => x.PlayerOrderConnectionIds.Contains(connectionId));

      player?.PlayerOrderConnectionIds.Remove(connectionId);
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
      
      return newPlayersList;
    }

    private void InformAboutPlayerOrderChanged(int sessionId) {
      var session = GetSession(sessionId);

      if (session is null) {
        return;
      }

      var playerNames = session.Players.Select(x => x.Username);

      foreach (var player in session.Players) {
        foreach (var connectionId in player.PlayerOrderConnectionIds) {
          _playerOrderHub.Clients.Client(connectionId).SendAsync("reorder", playerNames);
        }
      }
    }
  }
}
