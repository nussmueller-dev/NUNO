import { GameCardViewModel } from './../../shared/models/view-models/game-card-model';
import { GameCardComponent } from './../../shared/components/game-card/game-card.component';
import { Component, OnInit } from '@angular/core';
import { CardType } from 'src/app/shared/constants/card-types';
import { Color } from 'src/app/shared/constants/colors';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { GameService } from 'src/app/shared/services/game.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
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
}
