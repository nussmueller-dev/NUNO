import { GameCardViewModel } from './../../shared/models/view-models/game-card-model';
import { GameCardComponent } from './../../shared/components/game-card/game-card.component';
import { Component, OnInit } from '@angular/core';
import { CardType } from 'src/app/shared/constants/card-types';
import { Color } from 'src/app/shared/constants/colors';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  card?: GameCardViewModel;

  constructor() { }

  ngOnInit(): void {
    let newCrad = new GameCardViewModel();
    newCrad.cardType = CardType.DrawTwo;
    newCrad.color = Color.Green;

    this.card = newCrad;
  }

}
