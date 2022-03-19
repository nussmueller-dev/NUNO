using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NUNO_Backend.Database.Entities;
using NUNO_Backend.Enums;
using NUNO_Backend.Helpers;
using NUNO_Backend.Logic;
using NUNO_Backend.Models.BindingModels;
using System.Security.Cryptography;
using AuthorizeAttribute = NUNO_Backend.Helpers.AuthorizeAttribute;

namespace NUNO_Backend.Controllers {
  [Route("Users")]
  [ApiController]
  public class UsersController : ControllerBase {
    private AuthenticationLogic _authenticationLogic;
    private CurrentUserHelper _currentUserHelper;

    public UsersController(AuthenticationLogic authenticationLogic, CurrentUserHelper currentUserHelper) {
      _authenticationLogic = authenticationLogic;
      _currentUserHelper = currentUserHelper;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterBindingModel model) {
      var user = _authenticationLogic.Register(model);

      return Ok(_authenticationLogic.GetUserInformations(user));
    }

    [HttpPost("login")]
    public IActionResult Login(LoginBindingModel model) {
      var response = _authenticationLogic.Login(model);
       
      if (response is null) {
        return BadRequest(new { message = "Benutzername oder Passwort ist falsch" });
      }

      return Ok(response);
    }

    [Authorize(RoleType.Player, RoleType.Admin)]
    [HttpGet("token/enddate")]
    public DateTime GetTokenEndDate() {
      return _currentUserHelper.Token.ValidTo;
    }

    [Authorize(RoleType.Player)]
    [HttpPost("authenticate/token")]
    public IActionResult Authenticate() {
      var response = _authenticationLogic.GetUserInformations();

      return Ok(response);
    }
  }
}
