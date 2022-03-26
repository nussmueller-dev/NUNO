using Authentication.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalR.Hubs {
  [Authorize(Policy = "PlayerAuthorization")]
  public class TestHub : Hub {
    private readonly CurrentUserHelper _currentUserHelper;

    public TestHub(CurrentUserHelper currentUserHelper) {
      _currentUserHelper = currentUserHelper;
    }

    public string SendMessage(string username, string message) {
      return "asädlkfjhölasdk";
    }

    public override Task OnConnectedAsync() {
      string name = Context.User.Identity.Name;

      return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception) {
      string name = Context.User.Identity.Name;
      return base.OnDisconnectedAsync(exception);
    }
  }
}
