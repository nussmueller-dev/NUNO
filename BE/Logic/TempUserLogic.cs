using NUNO_Backend.Database;
using NUNO_Backend.Database.Entities;

namespace NUNO_Backend.Logic {
  public class TempUserLogic {
    const int MaxTempUserLifetime = 48;
    private readonly NunoDbContext _dbContext;

    public TempUserLogic(NunoDbContext dbContext) {
      _dbContext = dbContext;
    }

    public void FilterTempUsers() {
      var outdatedTempUsers = _dbContext.TempUsers.Where(x => DateTime.Now > x.LastLoginDate.AddHours(MaxTempUserLifetime)).ToList();

      foreach (var tempUser in outdatedTempUsers) {
        _dbContext.TempUsers.Remove(tempUser);
      }

      _dbContext.SaveChanges();
    }

    public TempUser CreateTempUser(string name) {
      FilterTempUsers();
      var newTempuser = new TempUser();

      newTempuser.Username = name;
      newTempuser.SessionId = Guid.NewGuid().ToString();
      return newTempuser;
    }
  }
}
