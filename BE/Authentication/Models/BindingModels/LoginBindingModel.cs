using System.ComponentModel.DataAnnotations;

namespace Authentication.Models.BindingModels {
  public class LoginBindingModel {
    [Required(ErrorMessage = "Der Benutzername muss angegeben werden")]
    public string Username { get; set; }
    [Required(ErrorMessage = "Das Passwort muss angegeben werden")]
    public string Password { get; set; }
  }
}
