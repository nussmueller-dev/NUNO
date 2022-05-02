using Game.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Game.Models.ViewModels {
  public class RulesViewModel {
    public int StartCardCount { get; set; }

    public bool Accumulate { get; set; }
    public bool JumpIn { get; set; }
    public bool Buzzer { get; set; }

    public RulesViewModel(Rules rules) {
      StartCardCount = rules.StartCardCount;
      Accumulate = rules.Accumulate;
      JumpIn = rules.JumpIn;
      Buzzer = rules.Buzzer;
    }
  }
}
