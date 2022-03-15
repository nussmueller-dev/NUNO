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
}
