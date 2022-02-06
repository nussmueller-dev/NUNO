using NUNO_Backend.Database;
using System.ComponentModel.DataAnnotations;

namespace NUNO_Backend.Helpers.Validators {
  public class UsernameExistsAttribute : ValidationAttribute {
    public UsernameExistsAttribute() {
      ErrorMessage = "Dieser Benutzername ist bereits vergeben";
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
      var username = (string)value;
      var dbContext = (NunoDbContext)validationContext.GetService(typeof(NunoDbContext));

      if (username is null) {
        return ValidationResult.Success;
      }

      return dbContext.Users.Any(x => x.Username == username) ? new ValidationResult(ErrorMessage) : ValidationResult.Success;
    }
  }
}
