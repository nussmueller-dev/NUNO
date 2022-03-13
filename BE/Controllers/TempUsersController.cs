using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUNO_Backend.Logic;
using NUNO_Backend.Models.BindingModels;
using NUNO_Backend.Models.ViewModels;

namespace NUNO_Backend.Controllers {
  [Route("users/temp")]
  [ApiController]
  public class TempUsersController : ControllerBase {
    private TempUserLogic _tempUserLogic;

    public TempUsersController(TempUserLogic tempUserLogic) {
      _tempUserLogic = tempUserLogic;
    }

    [HttpGet]
    public IActionResult Info() { 
    
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] TempUserBindingModel model) {
      var tempUser = _tempUserLogic.CreateTempUser(model.Username);
      var viewModel = new TempUserViewModel(tempUser.SessionId, tempUser.Username);

      return Ok(viewModel);
    }
  }
}
