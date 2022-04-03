import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { UnoRulesBindingModel } from '../models/binding-models/uno-rules-binding-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { PlayerViewModel } from '../models/view-models/player-view-model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private httpClient: HttpClient,
    private currentUserService: CurrentUserService
  ) { }

  public async createUnoSession(rules: UnoRulesBindingModel){
    return lastValueFrom(this.httpClient.post<number>(environment.BACKENDURL + 'sessions/create/uno', rules, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      }
    }));
  }

  public async joinSession(sessionId: number){
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + 'sessions/join', {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }


  public async getCreator(sessionId: number){
    return lastValueFrom(this.httpClient.get<string>(environment.BACKENDURL + 'sessions/creator', {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async getPlayers(sessionId: number){
    return lastValueFrom(this.httpClient.get<Array<PlayerViewModel>>(environment.BACKENDURL + 'sessions/players', {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async setPlayerOrder(sessionId: number, usernames: Array<string>){
    return lastValueFrom(this.httpClient.post<Array<string>>(environment.BACKENDURL + 'sessions/players/order', usernames, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async kickPlayer(sessionId: number, username: string){
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + `sessions/players/${username}/kick`, {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  }

  public async quit(sessionId: number){
    return lastValueFrom(this.httpClient.post(environment.BACKENDURL + 'sessions/quit', {}, {
      headers: {
        'Authorization': this.currentUserService.authenticationKey
      },
      params: {
        sessionId: sessionId
      }
    }));
  } 
}
