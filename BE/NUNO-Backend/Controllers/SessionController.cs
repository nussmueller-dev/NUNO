using Authentication.Attributes;
using Authentication.Helpers;
using Game;
using Game.CustomAuthentication;
using Game.UNO.Entities;
using Microsoft.AspNetCore.Mvc;

namespace NUNO_Backend.Controllers {
  [Route("sessions")]
  [ApiController]
  public class SessionController : ControllerBase {
    private readonly SessionLogic _sessionLogic;
    private readonly CurrentUserHelper _currentUserHelper;

    public SessionController(SessionLogic sessionLogic, CurrentUserHelper currentUserHelper) {
      _sessionLogic = sessionLogic;
      _currentUserHelper = currentUserHelper;
    }

    [Authorize]
    [HttpPost("create/uno")]
    public IActionResult CreateUnoSession([FromBody] UnoRules rules) {
      var session = _sessionLogic.CreateSession(rules, _currentUserHelper.CurrentUser);
      
      return Ok(session.Id);
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("players/reorder")]
    public IActionResult ReorderPlayers([FromBody] List<string> playerNames) {
      //var session = _sessionLogic.ReorderPlayers()

      return Ok();
    }
  }
}
