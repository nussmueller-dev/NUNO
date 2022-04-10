import { CardType } from './../../shared/constants/card-types';
import { GameCardViewModel } from './../../shared/models/view-models/game-card-model';
import { Component, OnInit } from '@angular/core';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { GameService } from 'src/app/shared/services/game.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { Color } from 'src/app/shared/constants/colors';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  animations: [
    trigger('cardsAnimation', [
      transition(':enter', [
        style({top: '-100vh', width: '0px', minWidth: '0vh', flex: '0 0 0', opacity: 0 }),
        animate('800ms ease-out', keyframes([
          style({width: '*', minWidth: '5vh', flex: '*', opacity: 0, offset: 0.2 }),
          style({top: '0%', opacity: 1, offset: 1 })
        ]))
      ]),
      transition(':leave', [
        style({top: '0%', width: '*', minWidth: '5vh', flex: '*',  opacity: 1}),
        animate('800ms ease-in-out', keyframes([
          style({top: '-100vh', opacity: 0, offset: 0.7 }),
          style({width: '0px', minWidth: '0vh', flex: '0 0 0', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class PlayComponent implements OnInit {
  private signalrConnection: SignalrConnection;
  players: Array<PlayerViewModel> = [];
  cards: Array<GameCardViewModel> = [];
  currentCard?: GameCardViewModel;
  sessionId: number = 0;

  load: Function = () => {    
    this.sessionService.getPlayers(this.sessionId).then((players) => {
      this.players = players;
    });

    this.gameService.getCards(this.sessionId).then((cards) => {
      this.cards = cards;
      this.orderCards();
    });

    this.gameService.getCurrentCard(this.sessionId).then((card: GameCardViewModel) => {
      this.currentCard = card;
    });
  }

  myTurn = () => {    
    
  }

  newCurrentCard = (card: GameCardViewModel) => {    
    this.currentCard = card;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private gameService: GameService,
    private popupService: PopupService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.load);
  }
  
  async ngOnInit() {
    await this.currentUserService.checkAuthentication();

    let sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    
    if(sessionId){
      this.sessionId = +sessionId;
    }else{
      this.router.navigate(['/welcome']);
      return;
    }

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/players?sessionId=' + sessionId);    
    this.signalrConnection.addEvent('newCurrentCard', this.newCurrentCard);
    this.signalrConnection.addEvent('myTurn', this.myTurn);
  }
  
  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  orderCards(){
    let colors = Object.values(Color).filter(x => +x);
    let sortedCards: Array<GameCardViewModel> = [];

    colors = _.orderBy(colors, x => this.cards.filter(y => y.color === x).length, 'asc');

    colors.forEach(color => {
        let cards = this.cards.filter(x => x.color === color);

        sortedCards.push(..._.orderBy(cards.filter(x => x.cardType === CardType.Number), x => x.number));
        sortedCards.push(...cards.filter(x => x.cardType === CardType.DrawTwo));
        sortedCards.push(...cards.filter(x => x.cardType === CardType.Skip));
        sortedCards.push(...cards.filter(x => x.cardType === CardType.Reverse));
    });

    sortedCards.push(...(this.cards.filter(x => x.cardType === CardType.Wild)));
    sortedCards.push(...(this.cards.filter(x => x.cardType === CardType.WildDrawFour)));

    this.cards = sortedCards;
  }

  multiPlayCards(){
    let randomIndex = _.random(0, this.cards.length -1);
    this.cards.push(this.cards[randomIndex]);
    this.orderCards();
  }

  layCard(card: GameCardViewModel){
    let randomIndex = _.random(0, this.cards.length -1);
    this.cards = _.remove(this.cards, (x, i) => i != randomIndex);
  }
}
