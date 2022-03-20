using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUNO_Backend.Database;
using NUNO_Backend.Database.Entities;
using NUNO_Backend.Enums;
using NUNO_Backend.Helpers;
using NUNO_Backend.Helpers.Validators;
using NUNO_Backend.Logic;
using NUNO_Backend.Models.BindingModels;
using NUNO_Backend.Models.ViewModels;

namespace NUNO_Backend.Controllers {
  [Route("users/temp")]
  [ApiController]
  public class TempUsersController : ControllerBase {
    private TempUserLogic _tempUserLogic;
    private CurrentUserHelper _currentUserHelper;
    private NunoDbContext _dbContext;

    public TempUsersController(TempUserLogic tempUserLogic, CurrentUserHelper currentUserHelper, NunoDbContext dbContext) {
      _tempUserLogic = tempUserLogic;
      _currentUserHelper = currentUserHelper;
      _dbContext = dbContext;
    }

    [HttpPost("create")]
    public IActionResult Create([FromBody] TempUserBindingModel model) {
      var tempUser = _tempUserLogic.CreateTempUser(model.Username);
      var viewModel = new TempUserViewModel(tempUser.SessionId, tempUser.Username, tempUser.Role);

      return Ok(viewModel);
    }

    [Authorize(RoleType.TempUser)]
    [HttpGet("current")]
    public IActionResult Info() {
      if (_currentUserHelper.CurrentUser.GetType() != typeof(TempUser)) {
        return Unauthorized();
      }

      var currentUser = (TempUser)_currentUserHelper.CurrentUser;
      var viewModel = new TempUserViewModel(currentUser.SessionId, currentUser.Username, currentUser.Role);

      currentUser.LastLoginDate = DateTime.Now;
      _dbContext.SaveChanges();

      return Ok(viewModel);
    }
  }
}
