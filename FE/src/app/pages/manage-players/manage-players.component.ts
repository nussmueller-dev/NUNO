import { SessionService } from 'src/app/shared/services/session.service';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit, OnDestroy {
  private signalrConnection: SignalrConnection;
  playerNames: Array<string> = [];
  creatorName: string = '';
  sessionId?: number;

  loadPlayerOrder: Function = () => {    
    this.sessionService.getPlayerOrder(this.sessionId ?? 0).then((playerNames) => {
      this.playerNames = playerNames;
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private sessionService: SessionService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.loadPlayerOrder);
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

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/playerorder?sessionId=' + sessionId);    
    this.signalrConnection.addEvent('reorder', (newPlayerNames: Array<string>) => {this.playerNames = newPlayerNames;});
  }
  
  ngOnDestroy() {
    this.signalrConnection.stop();
  }
}
