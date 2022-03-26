import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import * as SignalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection?: SignalR.HubConnection;

  constructor(
    private currentUserService: CurrentUserService
  ){}
  
  public startConnection = () => {
    let authenticationKey = this.currentUserService.token ?? this.currentUserService.sessionId;
    
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.BACKENDURL + 'test', {
        accessTokenFactory: () => authenticationKey ?? ''
      })
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => { console.log('Error while starting connection: '); console.log(err)})
  }
  public addTransferChartDataListener = () => {
    this.hubConnection?.on('transferchartdata', (data) => {
      console.log(data);
    });
  }

  public async test(){
    console.log(await this.hubConnection?.invoke('SendMessage', 'kapuut', 'arsch'));
  }
}
