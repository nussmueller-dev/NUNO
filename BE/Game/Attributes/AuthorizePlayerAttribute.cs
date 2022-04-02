using Authentication.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Game.Attributes {
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
  public class AuthorizePlayerAttribute : Attribute, IAuthorizationFilter {
    public void OnAuthorization(AuthorizationFilterContext context) {
      var currentUserHelper = context.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;
      var sessionLogic = context.HttpContext.RequestServices.GetService(typeof(SessionLogic)) as SessionLogic;
      
      context.HttpContext.Request.Query.TryGetValue("sessionId", out var querySessionId);
      int sessionId;

      if (querySessionId.ToString() is null || !int.TryParse(querySessionId, out sessionId)) {
        context.Result = new UnauthorizedResult();
        return;
      }

      var session = sessionLogic.GetSession(sessionId);
      if (session is null) {
        context.Result = new UnauthorizedResult();
        return;
      }

      if(!session.Players.Any(x => x.Username == currentUserHelper.CurrentUser.Username)) {
        context.Result = new UnauthorizedResult();
        return;
      }
    }
  }
}
