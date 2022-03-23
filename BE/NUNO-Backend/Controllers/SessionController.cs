using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NUNO_Backend.Controllers {
  [Route("sessions")]
  [ApiController]
  public class SessionController : ControllerBase {
    [HttpPost("create")]
    public IActionResult Create() {
      
      
      return Ok();
    }
  }
}
