using NUNO_Backend.Database;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;

namespace NUNO_Backend.Helpers.Validators {
  public class EmailValidationAttribute : ValidationAttribute {
    public EmailValidationAttribute() {
      ErrorMessage = "Diese Emailadresse ist ungültig";
    }

    protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
      var email = (string)value;
      var dbContext = (NunoDbContext)validationContext.GetService(typeof(NunoDbContext));

      if (email is null) {
        return new ValidationResult(ErrorMessage);
      }

      return IsEmailValid(email) ? ValidationResult.Success : new ValidationResult(ErrorMessage);
    }

    private bool IsEmailValid(string email) {
      if (string.IsNullOrWhiteSpace(email)) {
        return false;
      }

      try {
        email = Regex.Replace(email, @"(@)(.+)$", DomainMapper, RegexOptions.None, TimeSpan.FromMilliseconds(200));

        string DomainMapper(Match match) {
          var idn = new IdnMapping();

          string domainName = idn.GetAscii(match.Groups[2].Value);

          return match.Groups[1].Value + domainName;
        }
      } catch (RegexMatchTimeoutException e) {
        return false;
      } catch (ArgumentException e) {
        return false;
      }

      try {
        return Regex.IsMatch(email,
            @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
      } catch (RegexMatchTimeoutException) {
        return false;
      }
    }
  }
}
