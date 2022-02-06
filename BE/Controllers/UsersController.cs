using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NUNO_Backend.Helpers;
using NUNO_Backend.Logic;
using NUNO_Backend.Models.BindingModels;
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

    [Authorize]
    [HttpGet("token/enddate")]
    public DateTime GetTokenEndDate() {
      return _currentUserHelper.Token.ValidTo;
    }

    [HttpPost("authenticate")]
    public IActionResult Authenticate(LoginBindingModel model) {
      var response = _authenticationLogic.Authenticate(model);

      if (response is null)
        return BadRequest(new { message = "Benutzername oder Passwort ist falsch" });

      return Ok(response);
    }

    [Authorize]
    [HttpPost("authenticate/token")]
    public IActionResult Authenticate() {
      var response = _logic.AuthenticateWithToken();

      return Ok(response);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterBindingModel model) {
      User user = _bindingModelFactory.GetUserFromBindingModel(model);

      if (_context.Users.ToList().Count >= 1) {
        return BadRequest(new { message = "Es wurde bereits ein Benutzer erstellt" });
      }

      if (!_logic.IsValidEmail(model.Email)) {
        return BadRequest(new { message = "Die Email ist nicht gültig" });
      }

      if (model.Username.Length < 3) {
        return BadRequest(new { message = "Der Benutzername muss länger als 2 Zeichen sein" });
      }

      if (model.Password.Length < 6) {
        return BadRequest(new { message = "Das Passwort muss läner als 5 Zeichen sein" });
      }

      _context.Users.Add(user);
      _context.SaveChanges();

      AuthenticateBindingModel authenticateBindingModel = new AuthenticateBindingModel();
      authenticateBindingModel.Username = model.Username;
      authenticateBindingModel.Password = model.Password;
      return Authenticate(authenticateBindingModel);
    }
  }
}
