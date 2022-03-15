import { RoleType } from './../constants/roles';
import { Injectable } from '@angular/core';
import { LocalStorageConstants } from '../constants/localstorage-constants';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public get username(): string {
    return localStorage.getItem(LocalStorageConstants.USERNAME) ?? '';
  }

  public set username(username: string){
    localStorage.setItem(LocalStorageConstants.USERNAME, username);
  }

  public get role(): RoleType {
    return +(localStorage.getItem(LocalStorageConstants.ROLE) ?? 0);
  }

  public set role(role: RoleType){
    localStorage.setItem(LocalStorageConstants.ROLE, (+role).toString());
  }

  public get token(): string {
    return localStorage.getItem(LocalStorageConstants.TOKEN) ?? '';
  }

  public set token(token: string){
    localStorage.setItem(LocalStorageConstants.TOKEN, token);
  }
}
