using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalR.Authentication {
  public class PlayerInSessionRequirement : AuthorizationHandler<PlayerInSessionRequirement, HubInvocationContext>, IAuthorizationRequirement {
    private IHttpContextAccessor _httpContextAccessor;

    public PlayerInSessionRequirement(IHttpContextAccessor httpContextAccessor) {
      _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PlayerInSessionRequirement requirement, HubInvocationContext resource) {
      if (_httpContextAccessor.HttpContext.Request.Query.TryGetValue("username", out var username) &&
          username.Any() &&
          !string.IsNullOrWhiteSpace(username.FirstOrDefault()) &&
          username.FirstOrDefault() == "test_user") {
        context.Succeed(requirement);
      } else {
        context.Fail();
      }

      return Task.CompletedTask;
    }
  }
}
