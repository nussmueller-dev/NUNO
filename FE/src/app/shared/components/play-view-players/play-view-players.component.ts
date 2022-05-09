import { Component, Input } from '@angular/core';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { PlayerViewModel } from './../../models/view-models/player-view-model';
import { PopupService } from './../../services/popup.service';
import { SessionService } from './../../services/session.service';

@Component({
  selector: 'app-play-view-players',
  templateUrl: './play-view-players.component.html',
  styleUrls: ['./play-view-players.component.scss']
})
export class PlayViewPlayersComponent {
  @Input() players: Array<PlayerViewModel> = [];
  @Input() isReverseDirection: boolean = false;
  @Input() currentPlayerName?: string;
  @Input() creatorName?: string;
  @Input() sessionId?: number;
  currentUserService: CurrentUserService;

  constructor(
    private popupService: PopupService,
    private sessionService: SessionService,
    currentUserService: CurrentUserService
  ) {
    this.currentUserService = currentUserService;
  }

  async kick(playerName: string) {
    if (!await this.popupService.boolQuestionModal.show(`Möchtest du "${playerName}" wirklich aus dem Spiel entfernen?`, 'RAUS!', true)) {
      return;
    }

    this.sessionService.kickPlayer(this.sessionId ?? 0, playerName);
  }
}
