namespace Game.Entities {
  public class Rules {
    public int StartCardCount { get; set; } = 7;

    public bool Accumulate { get; set; } = true;
    public bool JumpIn { get; set; } = true;
    public bool Buzzer { get; set; } = false;
  }
}
