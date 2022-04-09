using Game.Logic;

namespace NUNO_Backend.Extensions {
  public static class GameExtension {
    public static void AddGameProject(this WebApplicationBuilder builder) {
      builder.Services.AddSingleton<SessionLogic>();
      builder.Services.AddScoped<GameLogic>();
    }
  }
}
