using Authentication.Helpers;
using Game.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;

namespace Game.Hubs {
  [Authorize(Policy = "PlayerAuthorization")]
  public class PlayersHub : Hub {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly SessionLogic _sessionLogic;

    public PlayersHub(CurrentUserHelper currentUserHelper, IHttpContextAccessor httpContextAccessor, SessionLogic sessionLogic) {
      _httpContextAccessor = httpContextAccessor;
      _sessionLogic = sessionLogic;
    }

    public override Task OnConnectedAsync() {
      _httpContextAccessor.HttpContext.Request.Query.TryGetValue("sessionId", out var querySessionId);

      var username = Context.User.Claims.FirstOrDefault(x => x.Type == "username").Value;
      var session = _sessionLogic.GetSession(int.Parse(querySessionId));
      var player = session.Players.First(x => x.Username == username);

      player.PlayerConnectionIds.Add(Context.ConnectionId);

      Groups.AddToGroupAsync(Context.ConnectionId, $"session-{ session.Id}");

      return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception) {
      var sessionId = _sessionLogic.RemoveConnectionId(Context.ConnectionId);

      if (sessionId != null) {
        Groups.RemoveFromGroupAsync(Context.ConnectionId, $"session-{sessionId}");
      }

      return base.OnDisconnectedAsync(exception);
    }
  }
}
