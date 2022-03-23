using System.ComponentModel.DataAnnotations;

namespace NUNO_Backend.Helpers.Validators {
  public class PasswordValidationAttribute : ValidationAttribute {
    private const string specialSymbols = "§°+¦\"@*#ç°%§&¬/|(¢)=?´`~!][{}_-.:,;<>\\";

    public PasswordValidationAttribute() {
      ErrorMessage = "Passwort ist zu unsicher";
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
      var password = (string)value;

      if (password is null) {
        return ValidationResult.Success;
      }

      if (password.Length < 8) {
        return new ValidationResult("Dass Passwort muss mindestens 8 Zeichen lang sein");
      }

      if (!password.Any(char.IsDigit)) {
        return new ValidationResult("Dass Passwort muss mindestens eine Zahl beinhalten");
      }

      if (!password.Any(x => specialSymbols.Contains(x))) {
        return new ValidationResult("Dass Passwort muss mindestens ein Sonderzeichen beinhalten");
      }

      return ValidationResult.Success;
    }
  }
}
