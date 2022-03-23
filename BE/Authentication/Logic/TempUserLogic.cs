using Data;
using Data.Entities;

namespace Authentication.Logic {
  public class TempUserLogic {
    private const int EXPIRY_DURATION_HOURS = 12;
    private readonly NunoDbContext _dbContext;

    public TempUserLogic(NunoDbContext dbContext) {
      _dbContext = dbContext;
    }

    public void FilterTempUsers() {
      var outdatedTempUsers = _dbContext.TempUsers.Where(x => DateTime.Now > x.LastLoginDate.AddHours(EXPIRY_DURATION_HOURS)).ToList();

      foreach (var tempUser in outdatedTempUsers) {
        _dbContext.TempUsers.Remove(tempUser);
      }

      _dbContext.SaveChanges();
    }

    public TempUser CreateTempUser(string name) {
      FilterTempUsers();
      var newTempuser = new TempUser();

      newTempuser.Username = name.Trim();
      newTempuser.SessionId = Guid.NewGuid().ToString();

      _dbContext.TempUsers.Add(newTempuser);
      _dbContext.SaveChanges();

      return newTempuser;
    }

    public TempUser GetTempUserFromSessionId(string sessionId) {
      FilterTempUsers();
      return _dbContext.TempUsers.FirstOrDefault(x => x.SessionId == sessionId);
    }
  }
}
