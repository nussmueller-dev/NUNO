import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionState } from 'src/app/shared/constants/session-states';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { environment } from 'src/environments/environment';
import { UtilServiceService } from './../../shared/services/util-service.service';

@Component({
  selector: 'app-waiting-for-start',
  templateUrl: './waiting-for-start.component.html',
  styleUrls: ['./waiting-for-start.component.scss']
})
export class WaitingForStartComponent implements OnInit {
  private signalrConnection: SignalrConnection;
  sessionState: SessionState = SessionState.ManagePlayers;
  sessionStates = SessionState;
  players: Array<PlayerViewModel> = [];
  myName: string = '';
  sessionId: number = 0;

  loadPlayers: Function = () => {
    this.sessionService.getPlayers(this.sessionId).then((players) => {
      this.players = players;
    });

    this.checkSessionState();
    this.checkCreator();
  }

  reorderPlayers = (newPlayers: Array<PlayerViewModel>) => {
    this.players = newPlayers;
  }

  gotKickedOut = () => {
    this.popupService.errorModal.show('Du wurdest aus dem Spiel entfernt');
    this.router.navigate(['/welcome']);
  }

  upgradedToCreator = () => {
    this.popupService.succesModal.show('Du wurdest zum Spielleiter befördert 🥳');
    this.router.navigate(['/manage-players'], { queryParamsHandling: 'merge' });
  }

  gameStarted = () => {
    this.router.navigate(['/play'], { queryParamsHandling: 'merge' });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private popupService: PopupService,
    private utilService: UtilServiceService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.loadPlayers);
  }

  async ngOnInit() {
    await this.currentUserService.checkAuthentication();
    this.myName = this.currentUserService.username ?? '';

    let sessionId = this.route.snapshot.queryParamMap.get('sessionId');

    if (sessionId) {
      this.sessionId = +sessionId;
    } else {
      this.router.navigate(['/welcome']);
      return;
    }

    await this.checkCreator();

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/players?sessionId=' + sessionId);
    this.signalrConnection.addEvent('reorder', this.reorderPlayers);
    this.signalrConnection.addEvent('kick', this.gotKickedOut);
    this.signalrConnection.addEvent('youAreCreatorNow', this.upgradedToCreator);
    this.signalrConnection.addEvent('gameStarts', this.gameStarted);
  }

  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  async quit() {
    if (!await this.popupService.boolQuestionModal.show('Möchtest du das Spiel wirklich verlassen?', 'Verlassen', true)) {
      return;
    }

    await this.sessionService.quit(this.sessionId);

    this.popupService.succesModal.show('Spiel erfolgreich verlassen');
    this.router.navigate(['/welcome']);
  }

  async checkSessionState() {
    let state = await this.sessionService.getState(this.sessionId).catch((error) => {
      if (error.status === 401) {
        this.router.navigate(['/welcome']);
        return;
      }
    });

    this.utilService.reactToSessionState(state, SessionState.ManagePlayers, this.myName === this.currentUserService.username);

    this.sessionState = state ?? SessionState.ManagePlayers;
  }

  async checkCreator() {
    let creator = await this.sessionService.getCreator(this.sessionId).catch((error) => {
      if (error.status === 401) {
        this.router.navigate(['/welcome']);
        return;
      }
    });

    if (creator === this.currentUserService.username) {
      this.router.navigate(['/manage-players'], { queryParamsHandling: 'merge' });
      return;
    }
  }
}
