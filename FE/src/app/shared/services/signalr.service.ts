import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import * as SignalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection?: SignalR.HubConnection;
  
  public startConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(environment.BACKENDURL + 'playerorder')
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
}
