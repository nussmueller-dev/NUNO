import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EasterEggService {
  private possibleTexts: Array<string> = ['jenny', 'cello', 'fun'];
  private correctTypedText: string = '';
  jennyEffect: boolean = false;
  celloEffect: boolean = false;

  keyPressed(key: string) {
    this.correctTypedText += key;

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
        this.celloEffect = !this.celloEffect;
        break;
    }

    this.correctTypedText = '';
  }
}
