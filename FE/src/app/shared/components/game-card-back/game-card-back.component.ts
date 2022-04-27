import { Component } from '@angular/core';
import { EasterEggService } from './../../services/easter-egg.service';

@Component({
  selector: 'app-game-card-back',
  templateUrl: './game-card-back.component.html',
  styleUrls: ['./game-card-back.component.scss']
})
export class GameCardBackComponent {
  easterEggService: EasterEggService;

  constructor(
    easterEggService: EasterEggService
  ) {
    this.easterEggService = easterEggService;
  }
}
