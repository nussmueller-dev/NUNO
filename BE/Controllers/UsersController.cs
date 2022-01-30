using Microsoft.AspNetCore.Mvc;

namespace NUNO_Backend.Controllers {
  [Route("Users")]
  [ApiController]
  public class UsersController : ControllerBase {
    [HttpGet]
    public IEnumerable<string> Get() {
      return new string[] { "value1", "value2" };
    }

    [HttpGet("{id}")]
    public string Get(int id) {
      return "value";
    }

    [HttpPost]
    public void Post([FromBody] string value) {
    }

    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value) {
    }

    [HttpDelete("{id}")]
    public void Delete(int id) {
    }
  }
}
