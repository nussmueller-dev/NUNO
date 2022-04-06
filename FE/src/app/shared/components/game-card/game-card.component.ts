import { Color } from './../../constants/colors';
import { CardType } from './../../constants/card-types';
import { GameCardViewModel } from './../../models/view-models/game-card-model';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  @Input() card?: GameCardViewModel;

  cardType = CardType;
  color = Color;
  height: number = 0;

  onResized(event: ResizedEvent) {
    this.height = event.newRect.height;
    console.log(this.height);
  }
}
