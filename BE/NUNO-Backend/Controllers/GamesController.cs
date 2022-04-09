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
        return Ok(newCards);
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("take-card")]
    public IActionResult TakeCard([FromQuery] int sessionId, int cardId, [FromQuery] ColorType? selectedColor) {
      var newCard = _gameLogic.TakeCard(sessionId);

      if (newCard is null) {
        return BadRequest("Nope");
      } else {
        return Ok(newCard);
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpPost("call-last-card")]
    public IActionResult CallLastCard([FromQuery] int sessionId) {
      var newCard = _gameLogic.TakeCard(sessionId);

      if (true) {
        return BadRequest("Noob");
      } else {
        return Ok();
      }
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpGet("cards")]
    public IActionResult LoadCards([FromQuery] int sessionId) {
      var cards = _gameLogic.GetCards(sessionId);
      var viewModels = cards.Select(x => new CardViewModel(x)).ToList();

      return Ok(viewModels);
    }

    [Authorize]
    [AuthorizePlayer]
    [HttpGet("current-card")]
    public IActionResult LoadCurrentCard([FromQuery] int sessionId) {
      var session = _sessionLogic.GetSession(sessionId);
      var currentCard = session?.CurrentCard;

      if (currentCard is null) {
        return BadRequest();
      } else {
        return Ok(new CardViewModel(currentCard));
      }
    }
  }
}
