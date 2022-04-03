import { sleep } from './../../constants/sleep';
import * as SignalR from "@microsoft/signalr";
import { CurrentUserService } from "../current-user.service";
import { DateTime, Duration } from "luxon";

export class SignalrConnection {
  private hubConnection?: SignalR.HubConnection;
  private connectionClosed = true;
  private serverUrl: string = '';
  private lastRestartTime: DateTime = DateTime.local();
  private onConnectedEvent?: Function;
  private connectionName = ''

  constructor(
    private currentUserService: CurrentUserService,
    onConnectedEvent?: Function
  ) {
    this.onConnectedEvent = onConnectedEvent;
  }

  public async start(url: string) {
    this.serverUrl = url;
    this.connectionClosed = false;

    if(url.includes('hubs/')){
      this.connectionName = url.slice(url.indexOf('hubs/') + 5, url.indexOf('?') ? url.indexOf('?') : url.length);
    }else{
      this.connectionName = url;
    }

    await this.currentUserService.awaitInitialCheckCompleted();
    let authenticationKey = this.currentUserService.token ?? this.currentUserService.sessionId;

    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(this.serverUrl, {
        accessTokenFactory: () => authenticationKey ?? ''
      })
      .configureLogging(SignalR.LogLevel.None)
      .build();

    await this.startConnection();
  }

  public async stop() {
    this.connectionClosed = true;
    await this.hubConnection?.stop();
  }

  public addEvent(methode: string, fn: (...args: any[]) => void) {
    this.hubConnection?.on(methode, fn);
  }

  public setOnConnectedEvent(fn: Function){
    this.onConnectedEvent = fn;
  }

  private async startConnection(restarting: boolean = false) {
    if (this.connectionClosed && restarting) {
      console.log('%cSignalR connection closed for ' + this.connectionName, 'color: #356986');
      return;
    }

    if (!this.connectionClosed && !restarting) {
      await this.hubConnection?.stop();
    }

    if(restarting){
      let time5SeccondsAgo = DateTime.local().minus(Duration.fromMillis(5000));
      let requiredDelay = time5SeccondsAgo.diff(this.lastRestartTime).milliseconds * -1;
      
      if(requiredDelay > 0){
        await sleep(requiredDelay);
      }
      
      console.log('%cSignalR connection restarting for ' + this.connectionName, 'color: orange');
      this.lastRestartTime = DateTime.local();
    }

    await this.hubConnection?.start()
      .then(() => {
        console.log('%cSignalR connection started for ' + this.connectionName, 'color: lime');

        if(this.onConnectedEvent){
          this.onConnectedEvent();
        }
      })
      .catch(err => {
        console.log('%cError while starting SignalR connection: ' + err, 'color: red');
        this.startConnection(true);
      });

    this.hubConnection?.onclose(() => {
      this.startConnection(true);
    });
  }
}