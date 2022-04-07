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
  private _card?: GameCardViewModel;  

  @Input() set card(value: GameCardViewModel | undefined){
    this._card = value;

    if(this._card?.cardType === CardType.Wild){
      switch(this._card.color){
        case Color.Blue:
          this.wildCardImageUrl = 'assets/images/wild_center_blue.svg';
          break;
          case Color.Green:
          this.wildCardImageUrl = 'assets/images/wild_center_green.svg';
          break;
          case Color.Red:
            this.wildCardImageUrl = 'assets/images/wild_center_red.svg';
            break;
          case Color.Yellow:
            this.wildCardImageUrl = 'assets/images/wild_center_yellow.svg';
            break;
          default:
            this.wildCardImageUrl = 'assets/images/wild_center.svg';
          break;
      }
    }
  }

  get card(): GameCardViewModel | undefined {
    return this._card;
  }
  
  cardType = CardType;
  color = Color;
  height: number = 0;
  wildCardImageUrl: string = '';

  onResized(event: ResizedEvent) {
    this.height = event.newRect.height;
  }
}
