import { GameService } from './../../shared/services/game.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit, OnDestroy {
  private signalrConnection: SignalrConnection;
  players: Array<PlayerViewModel> = [];
  creatorName: string = '';
  sessionId: number = 0;
  canStartGame: boolean = false;

  loadPlayers: Function = () => {    
    this.sessionService.getPlayers(this.sessionId).then((players) => {
      this.players = players;

      this.canStartGame = this.players.length >= 2;
    });
  }
  
  reorderPlayers = (newPlayers: Array<PlayerViewModel>) => {    
    this.players = newPlayers;

    this.canStartGame = this.players.length >= 2;
  }

  gameStarted = () => {    
    this.router.navigate(['/play'], { queryParamsHandling: 'merge' });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private gameService: GameService,
    private popupService: PopupService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.loadPlayers);
  }
  
  async ngOnInit() {
    await this.currentUserService.checkAuthentication();

    let sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    
    if(sessionId){
      this.sessionId = +sessionId;
    }else{
      this.router.navigate(['/rules']);
      return;
    }

    let creator = await this.sessionService.getCreator(this.sessionId).catch((error) => {
      if(error.status === 401){
        this.router.navigate(['/rules']);
        return;
      }
    });
    if(creator && creator === this.currentUserService.username){
      this.creatorName = creator;
    }else{
      this.router.navigate(['/rules']);
      return;
    }

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/players?sessionId=' + sessionId);    
    this.signalrConnection.addEvent('reorder', this.reorderPlayers);
    this.signalrConnection.addEvent('gameStarts', this.gameStarted);
  }
  
  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  playerDropped(event: CdkDragDrop<string[]>){
    moveItemInArray(this.players, event.previousIndex, event.currentIndex);

    this.sessionService.setPlayerOrder(this.sessionId, this.players.map(x => x.username));
  }

  async kick(playerName: string){
    if(!await this.popupService.boolQuestionModal.show(`Möchtest du "${playerName}" wirklich aus dem Spiel entfernen?`, 'RAUS!', true)){
      return;
    }

    this.sessionService.kickPlayer(this.sessionId, playerName);
  }

  async quit(){
    if(!await this.popupService.boolQuestionModal.show('Möchtest du das Spiel wirklich verlassen?', 'Verlassen', true)){
      return;
    }
    
    await this.sessionService.quit(this.sessionId);

    this.popupService.succesModal.show('Spiel erfolgreich verlassen');
    this.router.navigate(['/welcome']);
  }

  async startGame(){
    await this.gameService.startGame(this.sessionId);
  }
}
