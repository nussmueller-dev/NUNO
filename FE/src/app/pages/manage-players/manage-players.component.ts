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
  sessionId?: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService);
  }
  
  async ngOnInit() {
    await this.currentUserService.checkAuthentication();

    let sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    
    if(sessionId){
      this.sessionId = +sessionId;
    }else{
      this.router.navigate(['/rules']);
    }

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/playerorder?sessionId=' + sessionId);    
    this.signalrConnection.addEvent('reorder', this.reorderPlayers);
  }
  
  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  reorderPlayers(newPlayerNames: Array<string>){
    console.log(newPlayerNames);
  }
}
