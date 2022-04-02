using Authentication.Helpers;
using Authentication.Logic;
using Data.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Game.CustomAuthentication {
  public class PlayerAuthorizationHandler : AuthorizationHandler<PlayerAuthorizationRequirement> {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PlayerAuthorizationHandler(IHttpContextAccessor httpContextAccessor) {
      _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PlayerAuthorizationRequirement requirement) {
      var currentUser = GetCurrentUser();

      if (currentUser is null) {
        context.Fail();
        return Task.CompletedTask;
      }

      var sessionLogic = _httpContextAccessor.HttpContext.RequestServices.GetService(typeof(SessionLogic)) as SessionLogic;
      _httpContextAccessor.HttpContext.Request.Query.TryGetValue("sessionId", out var querySessionId);
      int sessionId;

      if (!int.TryParse(querySessionId, out sessionId)) {
        context.Fail();
        return Task.CompletedTask;
      }

      if (!sessionLogic.IsUserInSession(sessionId, currentUser)) {
        context.Fail();
        return Task.CompletedTask;
      }

      var currentUserHelper = _httpContextAccessor.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;
      currentUserHelper.SetCurrentUser(currentUser);

      var claimIdentity = new ClaimsIdentity();
      claimIdentity.AddClaim(new Claim("username", currentUser.Username));
      context.User.AddIdentity(claimIdentity);

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

      IUser user = authenticationLogic.GetUserFromToken(token);

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
