using Data.Interfaces;
using Game.Entities;
using Game.Interfaces.Entities;

namespace Game {
  public class SessionLogic {
    private Random Random = new Random();
    private List<Session> Sessions = new List<Session>();

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

    public List<Player> ReorderPlayers(int sessionId, List<string> playerNames) {
      var session = GetSession(sessionId);

      if (session is null || session.Players.Count != playerNames.Count) {
        return null;
      }

      if (!playerNames.All(x => session.Players.Any(y => y.Username == x))) {
        return null;
      }

      var newPlayersList = playerNames.Select(x => session.Players.First(y => y.Username == x)).ToList();
      session.Players = newPlayersList;
      
      return newPlayersList;
    }
  }
}
