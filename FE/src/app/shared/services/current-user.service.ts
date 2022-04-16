import { PopupService } from 'src/app/shared/services/popup.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { TempUserViewModel } from './../models/view-models/temp-user-view-model';
import { AuthenticationViewModel } from './../models/view-models/authentication-view-model';
import { RoleType } from './../constants/roles';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { sleep } from './../constants/sleep';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  public username?: string;
  public role?: RoleType;
  public token?: string;
  public sessionId?: string;
  public userIsAuthorized = false;
  private initialCheckCompleted = false;

  public get authenticationKey() { 
    if(this.token){
      return 'Bearer ' + this.token;
    } else if (this.sessionId) {
      return 'Session ' + this.sessionId;
    }else{
      return 'Upsi dupsi';
    }
  }

  constructor(
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private popupService: PopupService
  ) { }

  public setCurrentUser(authenticationViewModel: AuthenticationViewModel) {
    this.localStorageService.token = authenticationViewModel.token;

    this.username = authenticationViewModel.username;
    this.token = authenticationViewModel.token;
    this.role = authenticationViewModel.role;

    this.userIsAuthorized = true;
  }

  public setCurrentTempUser(tempUserViewModel: TempUserViewModel) {
    this.localStorageService.sessionId = tempUserViewModel.sessionId;

    this.username = tempUserViewModel.username;
    this.sessionId = tempUserViewModel.sessionId;
    this.role = tempUserViewModel.role;

    this.userIsAuthorized = true;
  }

  public async checkAuthentication() {
    while (!this.initialCheckCompleted) {
      await sleep(50);
    }

    if (this.userIsAuthorized) {
      return;
    }

    this.userIsAuthorized = false;
    this.router.navigate(['/welcome']);
  }

  public async tryReAuthentication() {
    let token = this.localStorageService.token;
    let sessionId = this.localStorageService.sessionId;

    if (token) {
      await this.authenticationService.loginWithToken(token)
      .then((authViewModel) => {
        this.setCurrentUser(authViewModel);
      })
      .catch((error) => {
        if(error.status === 401){
          this.localStorageService.token = '';
        }
      });
    }

    if (sessionId) {
      await this.authenticationService.getCurrentTempUser(sessionId)
      .then((tempUserViewModel) => {
        this.setCurrentTempUser(tempUserViewModel);
      })
      .catch((error) => {
        if(error.status === 401){
          this.localStorageService.sessionId = '';
        }
      });
    }

    this.initialCheckCompleted = true;
  }

  public logout() {
    if (this.sessionId && this.role === RoleType.TempUser) {
      this.authenticationService.deleteCurrentTempUser(this.sessionId);
    }

    this.localStorageService.token = '';
    this.localStorageService.sessionId = '';

    this.username = undefined;
    this.sessionId = undefined;
    this.role = undefined;

    this.userIsAuthorized = false;
    this.router.navigate(['/welcome']);

    this.popupService.succesModal.show('Erfolgreich abgemeldet');
  }

  public async awaitInitialCheckCompleted() {
    while (!this.initialCheckCompleted) {
      await sleep(10);
    }
  }
}
