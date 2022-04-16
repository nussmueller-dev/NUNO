import { Component, Input } from '@angular/core';
import { PlayerViewModel } from './../../models/view-models/player-view-model';

@Component({
  selector: 'app-play-view-players',
  templateUrl: './play-view-players.component.html',
  styleUrls: ['./play-view-players.component.scss']
})
export class PlayViewPlayersComponent {
  @Input() players: Array<PlayerViewModel> = [];
  @Input() isReverseDirection: boolean = false;
  @Input() mePlayer?: PlayerViewModel;
  @Input() currentPlayerName?: string;
}
