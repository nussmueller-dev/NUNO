import { UnoRulesBindingModel } from '../models/binding-models/uno-rules-binding-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public async createUnoSession(rules: UnoRulesBindingModel){
    return lastValueFrom(this.httpClient.post<number>(environment.BACKENDURL + 'sessions/create/uno', rules));
  }
}
