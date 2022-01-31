using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace NUNO_Backend.Helpers {
  [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
  public class AuthorizeAttribute {
    private IList<RoleType> _allowedRoles = new List<RoleType>();

    public AuthorizeAttribute() { }

    public AuthorizeAttribute(RoleType allowedRole) {
      _allowedRoles.Add(allowedRole);
    }

    public AuthorizeAttribute(IList<RoleType> allowedRole) {
      _allowedRoles = allowedRole;
    }

    public void OnAuthorization(AuthorizationFilterContext context) {
      var authorisationId = context.HttpContext.Session.GetString(SessionKeys.AuthorizationId);

      var authenticationHelper =
          context.HttpContext.RequestServices.GetService(typeof(AuthenticationHelper)) as AuthenticationHelper;

      var currentUserHelper =
          context.HttpContext.RequestServices.GetService(typeof(CurrentUserHelper)) as CurrentUserHelper;

      if (authorisationId is null || !authenticationHelper.IsAuthorized(new Guid(authorisationId))) {
        Unauthorized(context);
      } else {
        var user = authenticationHelper.GetUserFromGuid(new Guid(authorisationId));

        if (user is null) {
          Unauthorized(context);
          return;
        }

        if (_allowedRoles.Count == 0 || _allowedRoles.Contains(user.Role)) {
          currentUserHelper.SetCurrentUser(user);
        } else {
          Unauthorized(context);
        }
      }
    }

    private void Unauthorized(AuthorizationFilterContext context) {
      context.Result = new RedirectResult(url: "~/Authentication/Unauthorized");
    }
  }
}
