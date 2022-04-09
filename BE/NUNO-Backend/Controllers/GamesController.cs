using Authentication.Helpers;
using Game.Logic;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NUNO_Backend.Controllers {
  [Route("games")]
  [ApiController]
  public class GamesController : ControllerBase {
    private readonly SessionLogic _sessionLogic;
    private readonly CurrentUserHelper _currentUserHelper;

    public GamesController(SessionLogic sessionLogic, CurrentUserHelper currentUserHelper) {
      _sessionLogic = sessionLogic;
      _currentUserHelper = currentUserHelper;
    }
  }
}
