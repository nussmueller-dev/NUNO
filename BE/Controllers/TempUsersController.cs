using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUNO_Backend.Logic;
using NUNO_Backend.Models.BindingModels;

namespace NUNO_Backend.Controllers {
  [Route("users/temp")]
  [ApiController]
  public class TempUsersController : ControllerBase {
    private TempUserLogic _tempUserLogic;

    public TempUsersController(TempUserLogic tempUserLogic) {
      _tempUserLogic = tempUserLogic;
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] TempUserBindingModel model) {
      var tempUser = _tempUserLogic.CreateTempUser(model.Username);

      return Ok(_authenticationLogic.GetUserInformations(user));
    }
  }
}
