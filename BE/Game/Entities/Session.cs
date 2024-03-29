﻿using Game.Enums;

namespace Game.Entities {
  public class Session {
    public int Id { get; set; }
    public Rules Rules { get; set; }
    public SessionState State { get; set; } = SessionState.ManagePlayers;
    public bool NewPlayersCanJoin { get; set; } = true;
    public bool CanStarteGame { get; set; } = true;
    public Player Creator { get {
        return Players.FirstOrDefault(x => x.IsCreator);  
      } 
    }
    public List<Player> Players { get; set; } = new List<Player> { };
    public List<Card> CardStack { get; set; } = new List<Card> { };
    public List<Card> LaidCards { get; set; } = new List<Card> { };
    public Card CurrentCard { get; set; }
    public Player CurrentPlayer { get; set; }

    public bool IsReversing { get; set; } = false;
    public int AccumulateCardsDrawTwo { get; set; } = 0;
    public int AccumulateCardsDrawFour { get; set; } = 0;
  }
}
