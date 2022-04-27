import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EasterEggService {
  correctTypedJennyText: string = '';
  possibleJennyText: string = 'jenny';
  jennyEffect: boolean = false;

  keyPressed(event: KeyboardEvent) {
    if (event.key === this.possibleJennyText[this.correctTypedJennyText.length]) {
      this.correctTypedJennyText += event.key;
    } else {
      this.correctTypedJennyText = '';
    }

    if (this.correctTypedJennyText === this.possibleJennyText) {
      this.jennyEffect = true;
      this.correctTypedJennyText = '';
    }
  }
}
