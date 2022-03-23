using Authentication.Attributes;
using Authentication.Helpers;
using Authentication.Logic;
using Authentication.Models.BindingModels;
using Data.Enums;
using Microsoft.AspNetCore.Mvc;

namespace NUNO_Backend.Controllers {
  [Route("users")]
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
