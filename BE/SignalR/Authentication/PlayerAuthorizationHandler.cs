using Authentication.Helpers;
using Authentication.Logic;
using Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace SignalR.Authentication {
  public class PlayerAuthorizationHandler : AuthorizationHandler<PlayerAuthorizationRequirement> {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PlayerAuthorizationHandler(IHttpContextAccessor httpContextAccessor) {
      _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PlayerAuthorizationRequirement requirement) {
      var currentUser = GetCurrentUser();

      if (currentUser is null) {
        context.Fail();
      }

      var currentUserHelper = _httpContextAccessor.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;
      currentUserHelper.SetCurrentUser(currentUser);

      context.Succeed(requirement);

      return Task.CompletedTask;
    }

    private IUser GetCurrentUser() {
      var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

      if (token is null) {
        _httpContextAccessor.HttpContext.Request.Query.TryGetValue("access_token", out var queryToken);
        token = queryToken.ToString();
      }

      var authenticationLogic = _httpContextAccessor.HttpContext.RequestServices.GetService(typeof(AuthenticationLogic)) as AuthenticationLogic;
      var tempUserLogic = _httpContextAccessor.HttpContext.RequestServices.GetService(typeof(TempUserLogic)) as TempUserLogic;

      IUser user = null;
      user = authenticationLogic.GetUserFromToken(token);

      if (user is null) {
        user = tempUserLogic.GetTempUserFromSessionId(token);
      }

      if (user is null) {
        return null;
      }

      return user;
    }
  }
}
