import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AllGameInfosViewModel } from '../models/view-models/all-game-infos-view-model';
import { Color } from './../constants/colors';
import { GameCardViewModel } from './../models/view-models/game-card-model';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private httpClient: HttpClient,
    private currentUserService: CurrentUserService
  ) { }

  public async getAllInfos(sessionId: number) {
    return lastValueFrom(this.httpClient.get<AllGameInfosViewModel>(environment.BACKENDURL + 'games/all-infos', {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

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

  public async layCard(sessionId: number, cardId: number, selectedColor?: Color) {
    return lastValueFrom(this.httpClient.post<Array<GameCardViewModel>>(environment.BACKENDURL + `games/lay-card/${cardId}`, {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId,
        ...(selectedColor ? { selectedColor: selectedColor } : undefined)
      }
    }));
  }

  public async takeCard(sessionId: number) {
    return lastValueFrom(this.httpClient.post<GameCardViewModel>(environment.BACKENDURL + 'games/take-card', {}, {
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
}
