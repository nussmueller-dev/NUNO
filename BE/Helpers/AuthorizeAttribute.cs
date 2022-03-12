using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using NUNO_Backend.Enums;
using NUNO_Backend.Logic;

namespace NUNO_Backend.Helpers {
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
  public class AuthorizeAttribute : Attribute, IAuthorizationFilter {
    private IList<RoleType> _allowedRoles = new List<RoleType>();

    public AuthorizeAttribute() { }

    public AuthorizeAttribute(RoleType allowedRole) {
      _allowedRoles.Add(allowedRole);
    }

    public AuthorizeAttribute(IList<RoleType> allowedRole) {
      _allowedRoles = allowedRole;
    }

    public void OnAuthorization(AuthorizationFilterContext context) {
      var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

      var authenticationLogic = context.HttpContext.RequestServices.GetService(typeof(AuthenticationLogic)) as AuthenticationLogic;
      var currentUserHelper = context.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;

      var user = authenticationLogic.GetUserFromToken(token);

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
  }
}
