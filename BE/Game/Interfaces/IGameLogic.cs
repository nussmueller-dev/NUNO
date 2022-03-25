using Game.Interfaces.Entities;

namespace Game.Interfaces {
  public interface IGameLogic {
    public void Reset();
    public ICard TakeCard();
    public bool LayCard();
  }
}
