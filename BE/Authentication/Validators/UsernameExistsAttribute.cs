﻿using Authentication.Logic;
using Data;
using System.ComponentModel.DataAnnotations;

namespace Authentication.Validators {
  public class UsernameExistsAttribute : ValidationAttribute {
    public UsernameExistsAttribute() {
      ErrorMessage = "Dieser Benutzername ist bereits vergeben";
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
      var username = (string)value;
      var dbContext = (NunoDbContext)validationContext.GetService(typeof(NunoDbContext));
      var tempUserLogic = (TempUserLogic)validationContext.GetService(typeof(TempUserLogic));

      if (username is null) {
        return ValidationResult.Success;
      }

      var tempusers = dbContext.TempUsers.ToList();
      username = username.Trim();

      tempUserLogic.FilterTempUsers();

      var tempUserExists = dbContext.TempUsers.Any(x => x.Username == username);
      var normalUserExists = dbContext.Users.Any(x => x.Username == username);

      return normalUserExists || tempUserExists ? new ValidationResult(ErrorMessage) : ValidationResult.Success;
    }
  }
}
