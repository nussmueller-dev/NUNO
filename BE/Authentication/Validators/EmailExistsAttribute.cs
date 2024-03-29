﻿using Data;
using System.ComponentModel.DataAnnotations;

namespace Authentication.Validators {
  public class EmailExistsAttribute : ValidationAttribute {
    public EmailExistsAttribute() {
      ErrorMessage = "Diese Emailadresse ist bereits vergeben";
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
      var email = (string)value;
      var dbContext = (NunoDbContext)validationContext.GetService(typeof(NunoDbContext));

      if (email is null) {
        return ValidationResult.Success;
      }

      email = email.Trim();

      return dbContext.Users.Any(x => x.Email == email) ? new ValidationResult(ErrorMessage) : ValidationResult.Success;
    }
  }
}
