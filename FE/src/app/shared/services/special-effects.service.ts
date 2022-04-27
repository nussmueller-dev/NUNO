import { Injectable } from '@angular/core';
import * as confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class SpecialEffectsService {
  myConfetti: confetti.CreateTypes = {} as confetti.CreateTypes;

  public setCanvas(canvas: HTMLCanvasElement) {
    this.myConfetti = confetti.create(canvas, {
      resize: true
    });
  }

  public manyFirework(seconds: number) {
    let duration = seconds * 1000;
    let animationEnd = Date.now() + duration;

    let timeout: any = setInterval(() => {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(timeout);
      }

      this.firework();
    }, 250);
  }

  public firework() {
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    let particleCount = 30;

    this.myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: this.randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    this.myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: this.randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }

  private randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
