using Authentication.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;

namespace Game.Hubs {
  [Authorize(Policy = "PlayerAuthorization")]
  public class PlayerOrderHub : Hub {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly SessionLogic _sessionLogic;

    public PlayerOrderHub(CurrentUserHelper currentUserHelper, IHttpContextAccessor httpContextAccessor, SessionLogic sessionLogic) {
      _httpContextAccessor = httpContextAccessor;
      _sessionLogic = sessionLogic;
    }

    public override Task OnConnectedAsync() {
      _httpContextAccessor.HttpContext.Request.Query.TryGetValue("sessionId", out var querySessionId);

      var username = Context.User.Claims.FirstOrDefault(x => x.Type == "username").Value;
      var session = _sessionLogic.GetSession(int.Parse(querySessionId));
      var player = session.Players.First(x => x.Username == username);

      player.PlayerOrderConnectionIds.Add(Context.ConnectionId);

      return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception) {
      _sessionLogic.RemoveConnectionId(Context.ConnectionId);

      return base.OnDisconnectedAsync(exception);
    }
  }
}
