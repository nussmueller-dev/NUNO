using Authentication.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Game.CustomAuthentication {
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
  public class AuthorizeCreatorAttribute : Attribute, IAuthorizationFilter {
    public void OnAuthorization(AuthorizationFilterContext context) {
      var currentUserHelper = context.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;
      var sessionLogic = context.HttpContext.RequestServices.GetService(typeof(SessionLogic)) as SessionLogic;
      
      context.HttpContext.Request.Query.TryGetValue("sessionId", out var querySessionId);
      int sessionId;

      if (querySessionId.ToString() is null || !int.TryParse(querySessionId, out sessionId)) {
        context.Result = new UnauthorizedResult();
        return;
      }

      if (!sessionLogic.IsUserCreatorFromSession(sessionId, currentUserHelper.CurrentUser)) {
        context.Result = new UnauthorizedResult();
        return;
      }
    }
  }
}
