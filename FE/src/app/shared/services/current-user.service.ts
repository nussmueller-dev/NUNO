import { LocalStorageService } from './local-storage.service';
import { TempUserViewModel } from './../models/view-models/temp-user-view-model';
import { AuthenticationViewModel } from './../models/view-models/authentication-view-model';
import { RoleType } from './../constants/roles';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  public username?: string;
  public role?: RoleType;
  public token?: string;
  public sessionId?: string;

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  public setCurrentUser(authenticationViewModel: AuthenticationViewModel){
    this.localStorageService.username = authenticationViewModel.username;
    this.localStorageService.token = authenticationViewModel.token;
    this.localStorageService.role = authenticationViewModel.role;

    this.username = authenticationViewModel.username;
    this.token = authenticationViewModel.token;
    this.role = authenticationViewModel.role;
  }

  public setCurrentTempUser(tempUserViewModel: TempUserViewModel){
    this.localStorageService.username = tempUserViewModel.username;
    this.localStorageService.sessionId = tempUserViewModel.sessionId;
    this.localStorageService.role = tempUserViewModel.role;

    this.username = tempUserViewModel.username;
    this.sessionId = tempUserViewModel.sessionId;
    this.role = tempUserViewModel.role;
  }
}
