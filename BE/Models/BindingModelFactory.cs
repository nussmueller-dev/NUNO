using NUNO_Backend.Database;
using NUNO_Backend.Database.Entities;
using NUNO_Backend.Models.BindingModels;

namespace NUNO_Backend.Models {
  public class BindingModelFactory {
    private readonly NunoDbContext _dbContext;

    public BindingModelFactory(NunoDbContext dbContext) {
      _dbContext = dbContext;
    }
  }
}
