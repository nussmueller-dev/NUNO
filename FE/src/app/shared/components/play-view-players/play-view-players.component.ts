import { PlayerViewModel } from './../../models/view-models/player-view-model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-play-view-players',
  templateUrl: './play-view-players.component.html',
  styleUrls: ['./play-view-players.component.scss']
})
export class PlayViewPlayersComponent {
  @Input() players: Array<PlayerViewModel> = [];
  @Input() isReverseDirection: boolean = false;
  @Input() mePlayer?: PlayerViewModel;
}
