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
  card1?: GameCardViewModel;
  card2?: GameCardViewModel;
  card3?: GameCardViewModel;

  ngOnInit(): void {
    let newCrad = new GameCardViewModel();
    newCrad.cardType = CardType.Wild;
    // newCrad.color = Color.Yellow;

    this.card1 = newCrad;

    let newCrad2 = new GameCardViewModel();
    newCrad2.cardType = CardType.Number;
    newCrad2.color = Color.Red;
    newCrad2.number = 11;

    this.card2 = newCrad2;

    let newCrad3 = new GameCardViewModel();
    newCrad3.cardType = CardType.Skip;
    newCrad3.color = Color.Blue;

    this.card3 = newCrad3;
  }

}
