import { TempUserViewModel } from './../models/view-models/temp-user-view-model';
import { TempUserBindingModel } from './../models/binding-models/temp-user-binding-model';
import { LoginBindingModel } from './../models/binding-models/login-binding-model';
import { RegisterBindingModel } from './../models/binding-models/register-binding-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationViewModel } from '../models/view-models/authentication-view-model';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public async register(username: string, email: string, password: string){
    let bindingModel = new RegisterBindingModel(username, email, password);

    return lastValueFrom(this.httpClient.post<AuthenticationViewModel>(environment.BACKENDURL + 'users/register', bindingModel));
  }

  public async login(username: string, password: string){
    let bindingModel = new LoginBindingModel(username, password);

    return lastValueFrom(this.httpClient.post<AuthenticationViewModel>(environment.BACKENDURL + 'users/login', bindingModel));
  }

  public async loginWithToken(token: string){
    return lastValueFrom(this.httpClient.post<AuthenticationViewModel>(environment.BACKENDURL + 'users/authenticate/token', {}, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }));
  }

  public async getTokenEndDate(token: string){
    return lastValueFrom(this.httpClient.get<AuthenticationViewModel>(environment.BACKENDURL + 'users/token/enddate', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }));
  }

  public async createTempUser(username: string){
    let bindingModel = new TempUserBindingModel(username);

    return lastValueFrom(this.httpClient.post<TempUserViewModel>(environment.BACKENDURL + 'users/temp/create', bindingModel));
  } 

  public async getCurrentTempUser(sessionId: string){
    return lastValueFrom(this.httpClient.post<TempUserViewModel>(environment.BACKENDURL + 'users/temp/current', {}, {
      headers: {
        'Authorization': 'Session ' + sessionId
      }
    }));
  }
}
