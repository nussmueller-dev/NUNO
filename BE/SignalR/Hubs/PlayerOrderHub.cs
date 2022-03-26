using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SignalR.Hubs {
  [Authorize(Policy = "PlayerAuthorization")]
  public class PlayerOrderHub : Hub { }
}
