import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/shared/services/session.service';
import { isMobile } from '../../shared/constants/mobile-util';
import { CurrentUserService } from './../../shared/services/current-user.service';
import { PopupService } from './../../shared/services/popup.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent implements OnInit {
  sessionId: string = '';
  canJoinGame = true;

  constructor(
    private currentUserService: CurrentUserService,
    private popupService: PopupService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.currentUserService.checkAuthentication();
  }

  async joinSession() {
    if (!this.canJoinGame) {
      return;
    }

    if (!+this.sessionId) {
      this.popupService.errorModal.show('Spiel konnte nicht gefunden werden');
      return;
    }

    this.canJoinGame = false;

    await this.sessionService.joinSession(+this.sessionId).then(() => {
      try {
        if (isMobile()) {
          document.body.requestFullscreen();
        }
      } catch { }

      this.router.navigate(['/waiting'], { queryParams: { sessionId: this.sessionId } });
    }).catch((error) => {
      if (error.status === 401) {
        this.popupService.errorModal.show('Spiel konnte nicht gefunden werden');
      } else {
        this.popupService.errorModal.show('Es ist etwas schiefgelaufen');
      }
    });

    this.canJoinGame = true;
  }
}
