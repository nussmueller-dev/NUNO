using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Game.Hubs {
  [Authorize(Policy = "PlayerAuthorization")]
  public class PlayerOrderHub : Hub { }
}
