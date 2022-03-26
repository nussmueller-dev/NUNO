import { RoleType } from './../constants/roles';
import { Injectable } from '@angular/core';
import { LocalStorageConstants } from '../constants/localstorage-constants';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public get token(): string {
    return localStorage.getItem(LocalStorageConstants.TOKEN) ?? '';
  }

  public set token(token: string){
    localStorage.removeItem(LocalStorageConstants.TEMP_ID);
    localStorage.setItem(LocalStorageConstants.TOKEN, token);
  }
  
  public get sessionId(): string {
    return localStorage.getItem(LocalStorageConstants.TEMP_ID) ?? '';
  }
  
  public set sessionId(sessionId: string){
    localStorage.removeItem(LocalStorageConstants.TOKEN);
    localStorage.setItem(LocalStorageConstants.TEMP_ID, sessionId);
  }
}
