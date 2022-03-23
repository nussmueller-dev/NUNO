using Authentication.Validators;
using System.ComponentModel.DataAnnotations;

namespace Authentication.Models.BindingModels {
  public class RegisterBindingModel {
    [Required(ErrorMessage = "Die Email muss angegeben werden")]
    [EmailValidation]
    [EmailExists]
    public string Email { get; set; }
    [Required(ErrorMessage = "Der Benutzername muss angegeben werden")]
    [DoesntContain('@', ErrorMessage = "Der Benutzername darf kein '@' beinhalten")]
    [UsernameExists]
    public string Username { get; set; }
    [Required(ErrorMessage = "Das Passwort muss angegeben werden")]
    [PasswordValidation]
    public string Password { get; set; }
  }
}
