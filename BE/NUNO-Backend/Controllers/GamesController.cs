using Authentication.Attributes;
using Authentication.Helpers;
using Game.CustomAuthentication;
using Game.Enums;
using Game.Logic;
using Game.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace NUNO_Backend.Controllers {
  [Route("games")]
  [ApiController]
  public class GamesController : ControllerBase {
    private readonly GameLogic _gameLogic;
    private readonly SessionLogic _sessionLogic;
    private readonly CurrentUserHelper _currentUserHelper;

    public GamesController(GameLogic gameLogic, SessionLogic sessionLogic, CurrentUserHelper currentUserHelper) {
      _gameLogic = gameLogic;
      _currentUserHelper = currentUserHelper;
      _sessionLogic = sessionLogic;
    }


    [Authorize]
    [AuthorizePlayer]
    [HttpGet("all-infos")]
    public IActionResult LoadAllInfos([FromQuery] int sessionId) {
      var infos = _gameLogic.GetAllInfos(sessionId);

      if (infos is null) {
        return BadRequest("Nope");
      } else {
        return Ok(infos);
      }
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

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("lay-card/{cardId}")]
    public IActionResult LayCard([FromQuery] int sessionId, int cardId, [FromQuery] ColorType? selectedColor) {
      var newCards = _gameLogic.LayCard(sessionId, cardId, selectedColor);

      if (newCards is null) {
        return BadRequest("Nope");
      } else {
        var viewModels = newCards.Select(x => new CardViewModel(x)).ToList();
        return Ok(viewModels);
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("dont-lay")]
    public IActionResult DontLayCard([FromQuery] int sessionId) {
      var succes = _gameLogic.DontWantToLayCard(sessionId);

      if (succes) {
        return Ok();
      } else {
        return BadRequest("Nope");
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("take-card")]
    public IActionResult TakeCard([FromQuery] int sessionId, [FromQuery] ColorType? selectedColor) {
      var newCard = _gameLogic.TakeCard(sessionId);

      if (newCard is null) {
        return BadRequest("Nope");
      } else {
        return Ok(new CardViewModel(newCard));
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("call-last-card")]
    public IActionResult CallLastCard([FromQuery] int sessionId) {
      var succes = _gameLogic.CallLastCard(sessionId);

      if (succes) {
        return Ok();
      } else {
        return BadRequest("Noob");
      }
    }
  }
}
