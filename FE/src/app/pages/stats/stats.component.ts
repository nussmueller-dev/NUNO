import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { SessionState } from 'src/app/shared/constants/session-states';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { environment } from 'src/environments/environment';
import { GameService } from './../../shared/services/game.service';
import { SpecialEffectsService } from './../../shared/services/special-effects.service';
import { UtilServiceService } from './../../shared/services/util-service.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  private signalrConnection: SignalrConnection;
  private madeFirework = false;
  players: Array<PlayerViewModel> = [];
  myName: string = '';
  sessionCreator?: PlayerViewModel;
  sessionId: number = 0;

  load: Function = () => {
    this.gameService.getAllInfos(this.sessionId).then((infos) => {
      this.sessionCreator = infos.sessionCreator;
      this.players = this.orderPlayers(infos.players);
      this.utilService.reactToSessionState(infos.sessionState, SessionState.ShowResults, infos.currentPlayer === this.currentUserService.username);

      this.handleFirework();
    });
  }

  gotKickedOut = () => {
    this.popupService.errorModal.show('Du wurdest aus dem Spiel entfernt');
    this.router.navigate(['/welcome']);
  }

  playersChanged = (players: Array<PlayerViewModel>) => {
    this.players = this.orderPlayers(players);
    this.handleFirework();
  }

  gameStarted = () => {
    this.router.navigate(['/play'], { queryParamsHandling: 'merge' });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private gameService: GameService,
    private popupService: PopupService,
    private utilService: UtilServiceService,
    private specialEffectsService: SpecialEffectsService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.load);
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

    await this.sessionService.getState(this.sessionId).catch((error) => {
      if (error.status === 401) {
        this.router.navigate(['/welcome']);
        return;
      }
    });

    this.popupService.accumulateQuestionModal.modalShown = false;
    this.popupService.boolQuestionModal.modalShown = false;
    this.popupService.directlyLayCardQuestionModal.modalShown = false;
    this.popupService.selectColorModal.modalShown = false;

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/players?sessionId=' + sessionId);
    this.signalrConnection.addEvent('kick', this.gotKickedOut);
    this.signalrConnection.addEvent('players-info', this.playersChanged);
    this.signalrConnection.addEvent('gameStarts', this.gameStarted);
  }

  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  handleFirework() {
    if (!this.madeFirework
      && this.players.length > 0
      && this.currentUserService.username === this.players[0].username
    ) {
      this.madeFirework = true;
      this.specialEffectsService.manyFirework(5);
    }
  }

  orderPlayers(players: Array<PlayerViewModel>): Array<PlayerViewModel> {
    return _.orderBy(players, x => x.points, 'desc');
  }

  next() {
    if (this.sessionCreator?.username === this.myName) {
      this.router.navigate(['/manage-players'], { queryParamsHandling: 'merge' });
    } else {
      this.router.navigate(['/waiting'], { queryParamsHandling: 'merge' });
    }
  }

  async quit() {
    if (!await this.popupService.boolQuestionModal.show('Möchtest du das Spiel wirklich verlassen?', 'Verlassen', true)) {
      return;
    }

    await this.sessionService.quit(this.sessionId);

    this.signalrConnection.stop();
    this.popupService.succesModal.show('Spiel erfolgreich verlassen');
    this.router.navigate(['/welcome']);
  }
}
