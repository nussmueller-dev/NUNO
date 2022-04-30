import { animate, AnimationEvent, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Color } from 'src/app/shared/constants/colors';
import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { GameService } from 'src/app/shared/services/game.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { SignalrConnection } from 'src/app/shared/services/util/SignalrConnection';
import { environment } from 'src/environments/environment';
import { CardType } from './../../shared/constants/card-types';
import { SessionState } from './../../shared/constants/session-states';
import { GameCardViewModel } from './../../shared/models/view-models/game-card-model';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  animations: [
    trigger('cardsAnimation', [
      transition(':enter', [
        style({ top: '-100vh', width: '0px', minWidth: '0vh', flex: '0 0 0', opacity: 0 }),
        animate('800ms ease-out', keyframes([
          style({ width: '*', minWidth: '*', flex: '*', opacity: 0, offset: 0.2 }),
          style({ top: '0%', opacity: 1, offset: 1 })
        ]))
      ]),
      transition(':leave', [
        style({ top: '0%', width: '*', minWidth: '5vh', flex: '*', opacity: 1 }),
        animate('800ms ease-in-out', keyframes([
          style({ top: '-100vh', opacity: 0, offset: 0.7 }),
          style({ width: '0px', minWidth: '0vh', flex: '0 0 0', offset: 1 })
        ]))
      ])
    ]),
    trigger('cardShakeAnimation', [
      transition('true <=> false', [
        animate('500ms linear', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(5deg)', offset: 0.16 }),
          style({ transform: 'rotate(0deg)', offset: 0.32 }),
          style({ transform: 'rotate(-5deg)', offset: 0.49 }),
          style({ transform: 'rotate(0deg)', offset: 0.65 }),
          style({ transform: 'rotate(2deg)', offset: 0.82 }),
          style({ transform: 'rotate(0deg)', offset: 1 }),
        ]))
      ])
    ]),
    trigger('currentCardAnimation', [
      transition('visible => hidden', [
        style({ top: '-200px', opacity: 0, transform: 'scale(0)' }),
        animate('400ms ease-out', style({ top: '*', opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class PlayComponent implements OnInit {
  private signalrConnection: SignalrConnection;
  currentUserService: CurrentUserService;

  sessionCreator?: PlayerViewModel;

  fullscreenState = false;
  currentCardAnimationState: string = 'hidden';
  players: Array<PlayerViewModel> = [];
  currentPlayerName?: string;

  cards: Array<GameCardViewModel> = [];
  currentCard?: GameCardViewModel;
  lastCurrentCard?: GameCardViewModel;

  isReverseDirection: boolean = false;
  sessionId: number = 0;

  load: Function = () => {
    this.gameService.getAllInfos(this.sessionId).then((infos) => {
      this.players = infos.players;
      this.currentPlayerName = infos.currentPlayer?.username;
      this.currentCard = infos.currentCard;
      this.isReverseDirection = infos.isReverseDirection;
      this.sessionCreator = infos.sessionCreator;
      this.reactToSessionState(infos.sessionState);
      this.myCardsChanged(infos.myCards);
    });
  }

  gotKickedOut = () => {
    this.popupService.errorModal.show('Du wurdest aus dem Spiel entfernt');
    this.router.navigate(['/welcome']);
  }

  newCurrentCard = (newCurrentCard: GameCardViewModel) => {
    this.lastCurrentCard = this.currentCard;
    this.currentCard = newCurrentCard;
    this.currentCardAnimationState = 'hidden';
  }

  reverse = (isDirectionReverse: boolean) => {
    this.isReverseDirection = isDirectionReverse;
  }

  playersChanged = (players: Array<PlayerViewModel>) => {
    this.players = players;
  }

  newCurrentPlayer = (newCurrentPlayer: PlayerViewModel) => {
    this.currentPlayerName = newCurrentPlayer.username;
  }

  gotSkipped = () => {

  }

  myCardsChanged = (cards: Array<GameCardViewModel>) => {
    let newCardIds = cards.map(x => x.id);
    let oldCardIds = this.cards.map(x => x.id);

    cards.forEach(card => {
      if (!oldCardIds.includes(card.id)) {
        this.cards.push(card);
      }
    });

    this.cards = this.cards.filter(x => newCardIds.includes(x.id));
    this.orderCards();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private gameService: GameService,
    private popupService: PopupService
  ) {
    this.signalrConnection = new SignalrConnection(currentUserService, this.load);
    this.currentUserService = currentUserService;
  }

  async ngOnInit() {
    await this.currentUserService.checkAuthentication();

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

    await this.signalrConnection.start(environment.BACKENDURL + 'hubs/players?sessionId=' + sessionId);
    this.signalrConnection.addEvent('kick', this.gotKickedOut);
    this.signalrConnection.addEvent('newCurrentCard', this.newCurrentCard);
    this.signalrConnection.addEvent('reverse', this.reverse);
    this.signalrConnection.addEvent('players-info', this.playersChanged);
    this.signalrConnection.addEvent('currentPlayerChanged', this.newCurrentPlayer);
    this.signalrConnection.addEvent('youGotSkipped', this.newCurrentPlayer);
    this.signalrConnection.addEvent('myCardsChanged', this.myCardsChanged);

    window.addEventListener('resize', () => this.updateFullscreenState());
    this.updateFullscreenState();
  }

  ngOnDestroy() {
    this.signalrConnection.stop();
  }

  currentCardAnimationFinished(event: AnimationEvent) {
    if (event.toState === 'hidden') {
      this.currentCardAnimationState = 'visible';
      this.lastCurrentCard = undefined;
    }
  }

  async layCard(card: GameCardViewModel) {
    if (this.currentPlayerName === this.currentUserService.username) {
      let selectedColor;

      if (card.cardType === CardType.Wild || card.cardType === CardType.WildDrawFour) {
        selectedColor = await this.popupService.selectColorModal.show();

        card.color = selectedColor ?? undefined;
      }

      await this.gameService.layCard(this.sessionId, card.id, selectedColor ?? undefined).then((newCards) => { this.myCardsChanged(newCards) }).catch(() => {
        card.cantLayHelper = !card.cantLayHelper;
      });
    }
  }

  async takeCard() {
    if (this.currentPlayerName === this.currentUserService.username) {
      await this.gameService.takeCard(this.sessionId);
    }
  }

  lastCard() {

  }

  async quit() {
    if (!await this.popupService.boolQuestionModal.show('Möchtest du das Spiel wirklich verlassen?', 'Verlassen', true)) {
      return;
    }

    await this.sessionService.quit(this.sessionId);

    this.popupService.succesModal.show('Spiel erfolgreich verlassen');
    this.router.navigate(['/welcome']);
  }

  switchFullscreenMode() {
    if (this.fullscreenState) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  }

  updateFullscreenState() {
    this.fullscreenState = (screen.availHeight || screen.height - 30) <= window.innerHeight;
  }

  orderCards() {
    let colors = Object.values(Color).filter(x => +x);
    let sortedCards: Array<GameCardViewModel> = [];

    colors = _.orderBy(colors, x => this.cards.filter(y => y.color === x).length, 'asc');

    colors.forEach(color => {
      let cards = this.cards.filter(x => x.color === color);

      sortedCards.push(..._.orderBy(cards.filter(x => x.cardType === CardType.Number), x => x.number));
      sortedCards.push(...cards.filter(x => x.cardType === CardType.DrawTwo));
      sortedCards.push(...cards.filter(x => x.cardType === CardType.Skip));
      sortedCards.push(...cards.filter(x => x.cardType === CardType.Reverse));
    });

    sortedCards.push(...(this.cards.filter(x => x.cardType === CardType.Wild)));
    sortedCards.push(...(this.cards.filter(x => x.cardType === CardType.WildDrawFour)));

    this.cards = sortedCards;
  }

  reactToSessionState(sessionState: SessionState | null) {
    switch (sessionState) {
      case SessionState.ManagePlayers:
        if (this.sessionCreator?.username === this.currentUserService.username) {
          this.router.navigate(['/manage-players'], { queryParamsHandling: 'merge' });
        } else {
          this.router.navigate(['/waiting'], { queryParamsHandling: 'merge' });
        }
        break;
      case SessionState.ShowResults:
        this.router.navigate(['/welcome']);
        break;
    }
  }
}
