import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { SpecialEffectsService } from './special-effects.service';


export enum EasterEgg {
  Jenny = 'jenny',
  Cello = 'cello',
  Webi = 'webi',
  Rick = 'rick',
  Tobi = 'tobi',
  Richi = 'richi',
  Firework = 'firework',
  Fun = 'fun',
  Help = 'help',
  Jonathan = 'jonathan'
}

@Injectable({
  providedIn: 'root'
})
export class EasterEggService {
  private easterEggs: Array<EasterEgg> = [];
  private maxKeyDelay: number = 500;

  private correctTypedText: string = '';
  private lastKeyPress: DateTime = DateTime.local();
  jennyEffect: boolean = false;
  celloEffect: boolean = false;
  helpEffect: boolean = false;

  constructor(
    private specialEffectsService: SpecialEffectsService
  ) {
    this.easterEggs = Object.keys(EasterEgg) as Array<EasterEgg>;
  }

  getAllCommands() {
    return this.easterEggs.map(x => x.toLowerCase());;
  }

  keyPressed(key: string) {
    let possibleCommands = this.getAllCommands();

    if (key === 'Escape') {
      this.jennyEffect = false;
      this.celloEffect = false;

      this.correctTypedText = '';
      return;
    }

    let keyPressDelay = this.lastKeyPress.diffNow().milliseconds * -1;
    this.lastKeyPress = DateTime.local();
    if (keyPressDelay > this.maxKeyDelay) {
      this.correctTypedText = '';
    }

    this.correctTypedText += key.toLocaleLowerCase();

    if (!possibleCommands.some(x => x.startsWith(this.correctTypedText))) {
      this.correctTypedText = '';
      return;
    }

    if (!possibleCommands.some(x => x === this.correctTypedText)) {
      return;
    }

    switch (this.correctTypedText) {
      case EasterEgg.Jenny:
        this.jennyEffect = !this.jennyEffect;
        break;
      case EasterEgg.Cello:
      case EasterEgg.Webi:
        this.celloEffect = !this.celloEffect;
        break;
      case EasterEgg.Rick:
        this.openUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        break;
      case EasterEgg.Tobi:
        this.openUrl('https://www.youtube.com/watch?v=1BXKsQ2nbno');
        break;
      case EasterEgg.Richi:
        this.openUrl('https://www.youtube.com/watch?v=5KFJxif2BiU');
        break;
      case EasterEgg.Jonathan:
        this.openUrl('https://youtube.com/watch?v=hFKUXWnjvAU&feature=share');
        break;
      case EasterEgg.Fun:
      case EasterEgg.Firework:
        this.specialEffectsService.manyFirework(5);
        break;
      case EasterEgg.Help:
        this.helpEffect = !this.helpEffect;
        break;
    }

    this.correctTypedText = '';
  }

  private openUrl(url: string) {
    window.open(url, '_blank')?.focus();
  }
}
