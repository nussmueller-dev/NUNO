import { Injectable } from '@angular/core';
import * as SignalR from "@aspnet/signalr";
import { environment } from 'src/environments/environment';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrPlayerOrderService {
  private hubConnection?: SignalR.HubConnection;
  private connectionActive = false;

  constructor(
    private currentUserService: CurrentUserService
  ){}
  
  public async startConnection() {
    let authenticationKey = this.currentUserService.token ?? this.currentUserService.sessionId;

    if (this.connectionActive) {
      await this.hubConnection?.stop();
      console.log('Connection for PlayerOrder restarting');
    }

    this.hubConnection = new SignalR.HubConnectionBuilder()
    .withUrl(environment.BACKENDURL + 'playerorder', {
      accessTokenFactory: () => authenticationKey ?? ''
    })
    .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection for PlayerOrder started');
        this.connectionActive = true;
      })
      .catch(err => console.log('Error while starting connection for PlayerOrder: ' + err));

    this.hubConnection.onclose(() => {
      console.log('Closeing');
      this.connectionActive = false;
      this.startConnection();
    });
  }

  public stopConnection(){
    this.hubConnection?.stop();
  }
}
