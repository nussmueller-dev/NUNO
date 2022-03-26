import { SignalrPlayerOrderService } from './../../shared/services/signalr-player-order.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-players',
  templateUrl: './manage-players.component.html',
  styleUrls: ['./manage-players.component.scss']
})
export class ManagePlayersComponent implements OnInit, OnDestroy {
  constructor(
    private signalrPlayerOrderService: SignalrPlayerOrderService
  ) { }
  
  async ngOnInit() {
    await this.signalrPlayerOrderService.startConnection();
  }
  
  ngOnDestroy() {
    
  }
}
