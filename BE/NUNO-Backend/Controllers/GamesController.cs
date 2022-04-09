using Authentication.Attributes;
using Authentication.Helpers;
using Game.CustomAuthentication;
using Game.Logic;
using Microsoft.AspNetCore.Mvc;

namespace NUNO_Backend.Controllers {
  [Route("games")]
  [ApiController]
  public class GamesController : ControllerBase {
    private readonly GameLogic _gameLogic;
    private readonly CurrentUserHelper _currentUserHelper;

    public GamesController(GameLogic gameLogic, CurrentUserHelper currentUserHelper) {
      _gameLogic = gameLogic;
      _currentUserHelper = currentUserHelper;
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("start")]
    public IActionResult StartGame([FromQuery] int sessionId) {
      var startedGame = _gameLogic.StartGame(sessionId);

      if (startedGame) {
        return Ok();
      } else {
        return BadRequest("Es befinden sich noch zu wenige Spieler in dieser Runde");
      }
    }
  }
}
