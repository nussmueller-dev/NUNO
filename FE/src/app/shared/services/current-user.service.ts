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
  private userIsAuthorized = false;
  private initialCheckCompleted = false;

  constructor(
    private localStorageService: LocalStorageService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  public setCurrentUser(authenticationViewModel: AuthenticationViewModel){
    this.localStorageService.token = authenticationViewModel.token;

    this.username = authenticationViewModel.username;
    this.token = authenticationViewModel.token;
    this.role = authenticationViewModel.role;
    
    this.userIsAuthorized = true;
  }
  
  public setCurrentTempUser(tempUserViewModel: TempUserViewModel){
    this.localStorageService.sessionId = tempUserViewModel.sessionId;
    
    this.username = tempUserViewModel.username;
    this.sessionId = tempUserViewModel.sessionId;
    this.role = tempUserViewModel.role;
    
    this.userIsAuthorized = true;
  }

  public async checkAuthentication(){
    while(!this.initialCheckCompleted){
      await sleep(50);
    }

    if(this.userIsAuthorized){
      return;
    }
    
    this.userIsAuthorized = false;
    this.router.navigate(['/welcome']);
  }

  public async tryReAuthentication(){
    let token = this.localStorageService.token;
    let sessionId = this.localStorageService.sessionId;

    if(token){
      let authViewModel = await this.authenticationService.loginWithToken(token);

      if(authViewModel){
        this.setCurrentUser(authViewModel);
        this.initialCheckCompleted = true;
        return;
      }else{
        this.localStorageService.token = '';
      }
    }

    if(sessionId){
      let tempUserViewModel = await this.authenticationService.getCurrentTempUser(sessionId);

      if(tempUserViewModel){
        this.setCurrentTempUser(tempUserViewModel);
        this.initialCheckCompleted = true;
        return;
      }else{
        this.localStorageService.sessionId = '';
      }
    }

    this.initialCheckCompleted = true;
  }
}
