import { SignalrConnection } from './Util/SignalrConnection';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrPlayerOrderService {
  private signalrConnection: SignalrConnection;

  constructor(
    currentUserService: CurrentUserService
  ){
    this.signalrConnection = new SignalrConnection(currentUserService);
  }
  
  public async start(){
    await this.signalrConnection.start(environment.BACKENDURL + 'playerorder');
  }

  public async stop(){
    await this.signalrConnection.stop();
  }

  public addEvent(methode: string, fn: (...args: any[]) => void){
    this.signalrConnection.addEvent(methode, fn);
  }
}
