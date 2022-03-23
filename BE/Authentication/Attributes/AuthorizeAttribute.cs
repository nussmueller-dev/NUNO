using Authentication.Helpers;
using Authentication.Logic;
using Data.Enums;
using Data.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Authentication.Attributes {
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
  public class AuthorizeAttribute : Attribute, IAuthorizationFilter {
    private IList<RoleType> _allowedRoles = new List<RoleType>();

    public AuthorizeAttribute() { }

    public AuthorizeAttribute(params RoleType[] allowedRoles) {
      foreach (var role in allowedRoles) {
        _allowedRoles.Add(role);

        AddBiggerTypes(role);
      }
    }

    public void OnAuthorization(AuthorizationFilterContext context) {
      var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

      var authenticationLogic = context.HttpContext.RequestServices.GetService(typeof(AuthenticationLogic)) as AuthenticationLogic;
      var currentUserHelper = context.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;
      var tempUserLogic = context.HttpContext.RequestServices.GetService(typeof(TempUserLogic)) as TempUserLogic;

      IUser user = null;
      if (_allowedRoles.Count != 1 || !_allowedRoles.Contains(RoleType.TempUser)) {
        user = authenticationLogic.GetUserFromToken(token);
      }

      if (user is null && (_allowedRoles.Count == 0 || _allowedRoles.Contains(RoleType.TempUser))) {
        user = tempUserLogic.GetTempUserFromSessionId(token);
      }

      if (user is null) {
        context.Result = new UnauthorizedResult();
        return;
      }

      if (_allowedRoles.Count == 0 || _allowedRoles.Contains(user.Role)) {
        currentUserHelper.SetCurrentUser(user);
      } else {
        context.Result = new UnauthorizedResult();
      }
    }

    private void AddBiggerTypes(RoleType allowedRole) {
      if (allowedRole == RoleType.Admin) {
        _allowedRoles.Add(RoleType.Owner);
      }

      if (allowedRole == RoleType.Player) {
        _allowedRoles.Add(RoleType.Owner);
        _allowedRoles.Add(RoleType.Admin);
      }
    }
  }
}
