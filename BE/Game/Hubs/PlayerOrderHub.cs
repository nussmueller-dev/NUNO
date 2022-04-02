using Authentication.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Game.Hubs {
  [Authorize(Policy = "PlayerAuthorization")]
  public class PlayerOrderHub : Hub {
    private readonly CurrentUserHelper _currentUserHelper;

    public PlayerOrderHub(CurrentUserHelper currentUserHelper) {
      _currentUserHelper = currentUserHelper;
    }

    public override Task OnConnectedAsync() {
      string name = Context.ConnectionId;
      var user = Clients.Client(name).SendAsync("test");

      return base.OnConnectedAsync();
    }
  }
}
