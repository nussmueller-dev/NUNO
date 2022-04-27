import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { SpecialEffectsService } from './special-effects.service';

@Injectable({
  providedIn: 'root'
})
export class EasterEggService {
  private possibleTexts: Array<string> = ['jenny', 'cello', 'webi', 'rick', 'tobi', 'richi', 'firework', 'fun', 'help'];
  private maxKeyDelay: number = 500;

  private correctTypedText: string = '';
  private lastKeyPress: DateTime = DateTime.local();
  jennyEffect: boolean = false;
  celloEffect: boolean = false;
  helpEffect: boolean = false;

  constructor(
    private specialEffectsService: SpecialEffectsService
  ) { }

  getAllCommands() {
    return this.possibleTexts;
  }

  keyPressed(key: string) {
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

    if (!this.possibleTexts.some(x => x.startsWith(this.correctTypedText))) {
      this.correctTypedText = '';
      return;
    }

    if (!this.possibleTexts.some(x => x === this.correctTypedText)) {
      return;
    }

    switch (this.correctTypedText) {
      case this.possibleTexts[0]:
        this.jennyEffect = !this.jennyEffect;
        break;
      case this.possibleTexts[1]:
      case this.possibleTexts[2]:
        this.celloEffect = !this.celloEffect;
        break;
      case this.possibleTexts[3]:
        //rick
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        break;
      case this.possibleTexts[4]:
        //tobi
        window.location.href = 'https://www.youtube.com/watch?v=1BXKsQ2nbno';
        break;
      case this.possibleTexts[5]:
        //richi
        window.location.href = 'https://www.youtube.com/watch?v=5KFJxif2BiU';
        break;
      case this.possibleTexts[6]:
      case this.possibleTexts[7]:
        this.specialEffectsService.manyFirework(5);
        break;
      case this.possibleTexts[8]:
        this.helpEffect = !this.helpEffect;
        console.log(this.helpEffect);
        break;
    }

    this.correctTypedText = '';
  }
}
