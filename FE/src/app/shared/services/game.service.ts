import { GameCardViewModel } from './../models/view-models/game-card-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private httpClient: HttpClient,
    private currentUserService: CurrentUserService
  ) { }

  public async startGame(sessionId: number) {
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + 'games/start', {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async layCard(sessionId: number, cardId: number) {
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + `games/lay-card/${cardId}`, {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async takeCard(sessionId: number) {
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + 'games/take-card', {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async callLastCard(sessionId: number) {
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + 'games/call-last-card', {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async getCards(sessionId: number) {
    return lastValueFrom(this.httpClient.get<Array<GameCardViewModel>>(environment.BACKENDURL + 'games/cards', {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async getCurrentCard(sessionId: number) {
    return lastValueFrom(this.httpClient.get<GameCardViewModel>(environment.BACKENDURL + 'games/current-card', {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }
}
