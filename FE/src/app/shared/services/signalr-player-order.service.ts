import { Injectable } from '@angular/core';
import * as SignalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrPlayerOrderService {
  private hubConnection?: SignalR.HubConnection;
  private connectionClosed = true;

  constructor(
    private currentUserService: CurrentUserService
  ){}
  
  public async startConnection(restarting: boolean = false) {
    if(this.connectionClosed && restarting){
      return;
    }

    if(!this.connectionClosed && !restarting){
      await this.hubConnection?.stop();
    }

    this.connectionClosed = false;

    await this.currentUserService.awaitInitialCheckCompleted();
    let authenticationKey = this.currentUserService.token ?? this.currentUserService.sessionId;

    this.hubConnection = new SignalR.HubConnectionBuilder()
    .withUrl(environment.BACKENDURL + 'playerorder', {
      accessTokenFactory: () => authenticationKey ?? ''
    })
    .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection for PlayerOrder started');
      })
      .catch(err => console.log('Error while starting connection for PlayerOrder: ' + err));

    this.hubConnection.onclose(() => {
      this.startConnection(true);
    });
  }

  public stopConnection(){
    this.connectionClosed = true;
    this.hubConnection?.stop();
  }
}
