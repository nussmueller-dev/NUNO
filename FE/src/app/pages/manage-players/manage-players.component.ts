import { ActivatedRoute, Router } from '@angular/router';
import { SignalrPlayerOrderService } from './../../shared/services/signalr-player-order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit, OnDestroy {
  sessionId?: number;

  constructor(
    private signalrPlayerOrderService: SignalrPlayerOrderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  async ngOnInit() {
    await this.signalrPlayerOrderService.start();    

    this.signalrPlayerOrderService.addEvent('test', () => { console.log('Dis könnte ein Test sein'); });
    
    let sessionId = this.route.snapshot.queryParamMap.get('sessionId');

    if(sessionId){
      this.sessionId = +sessionId;
    }else{
      this.router.navigate(['/rules']);
    }
  }
  
  ngOnDestroy() {
    this.signalrPlayerOrderService.stop();
  }
}
