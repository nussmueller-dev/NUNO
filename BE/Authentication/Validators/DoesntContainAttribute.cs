using System.ComponentModel.DataAnnotations;

namespace NUNO_Backend.Helpers.Validators {
  public class DoesntContainAttribute : ValidationAttribute {
    private char _invalidChar;

    public DoesntContainAttribute(char invalidChar) {
      _invalidChar = invalidChar;

      ErrorMessage = "Das folgende Zeichen ist nicht zugelassen: " + _invalidChar;
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
      var text = (string)value;

      if (text is null) {
        return ValidationResult.Success;
      }

      return text.Contains(_invalidChar) ? new ValidationResult(ErrorMessage) : ValidationResult.Success;
    }
  }
}
