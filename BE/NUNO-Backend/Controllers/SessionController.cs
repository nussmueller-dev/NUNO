using Authentication.Attributes;
using Authentication.Helpers;
using Game;
using Game.CustomAuthentication;
using Game.UNO.Entities;
using Microsoft.AspNetCore.Mvc;

namespace NUNO_Backend.Controllers {
  [Route("sessions")]
  [ApiController]
  [Produces("application/json")]
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
    [HttpPost("join")]
    public IActionResult JoinSession([FromQuery] int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);

      if (session is null) {
        return Unauthorized();
      }

      if (_sessionLogic.JoinSession(sessionId, _currentUserHelper.CurrentUser)) {
        return Ok(session.Id);
      } else {
        return BadRequest(new { message = "Du bist bereits in diesem Spiel" });
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpGet("creator")]
    public IActionResult GetCreator([FromQuery] int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);

      if (session is null) {
        return Unauthorized();
      }

      var creatorName = session.Players.FirstOrDefault(x => x.IsCreator)?.Username;

      return Ok(creatorName);
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpGet("players/order")]
    public IActionResult GerPlayerOrder([FromQuery] int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);

      if (session is null) {
        return Unauthorized();
      }

      var playerNames = session.Players.Select(x => x.Username).ToList();

      return Ok(playerNames);
    }

    [Authorize]
    [AuthorizeCreator]
    [HttpPost("players/order")]
    public IActionResult ReorderPlayers([FromQuery] int sessionId, [FromBody] List<string> playerNames) {
      var newPlayerList = _sessionLogic.ReorderPlayers(sessionId, playerNames);
      var newPlayerOrder = newPlayerList.Select(x => x.Username).ToList();

      return Ok(newPlayerOrder);
    }
  }
}
