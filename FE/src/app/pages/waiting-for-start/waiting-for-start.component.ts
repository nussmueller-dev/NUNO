import { PopupService } from 'src/app/shared/services/popup.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-waiting-for-start',
  templateUrl: './waiting-for-start.component.html',
  styleUrls: ['./waiting-for-start.component.scss']
})
export class WaitingForStartComponent implements OnInit {
  private signalrConnection: SignalrConnection;
  players: Array<PlayerViewModel> = [];
  myName: string = '';
  sessionId: number = 0;

  loadPlayers: Function = () => {    
    this.sessionService.getPlayers(this.sessionId).then((players) => {
      this.players = players;
    });
  }
  
  reorderPlayers = (newPlayers: Array<PlayerViewModel>) => {    
    this.players = newPlayers;
  }

  gotKickedOut = () => {  
    this.popupService.errorModal.showErrorMessage('Du wurdest aus dem Spiel entfernt');
    this.router.navigate(['/welcome']);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private popupService: PopupService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.loadPlayers);
  }

  async ngOnInit() {
    await this.currentUserService.checkAuthentication();
    this.myName = this.currentUserService.username ?? '';

    let sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    
    if(sessionId){
      this.sessionId = +sessionId;
    }else{
      this.router.navigate(['/welcome']);
      return;
    }

    let creator = await this.sessionService.getCreator(this.sessionId).catch((error) => {
      if(error.status === 401){
        this.router.navigate(['/welcome']);
        return;
      }
    });
    if(!creator){
      this.router.navigate(['/welcome']);
      return;
    }

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/players?sessionId=' + sessionId);    
    this.signalrConnection.addEvent('reorder', this.reorderPlayers);
    this.signalrConnection.addEvent('kick', this.gotKickedOut);
  }

  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  async quit(){
    await this.sessionService.quit(this.sessionId);

    this.popupService.succesModal.showSuccesMessage('Spiel erfolgreich verlassen');
    this.router.navigate(['/welcome']);
  }
}
