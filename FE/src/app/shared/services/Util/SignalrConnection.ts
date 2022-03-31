import * as SignalR from "@aspnet/signalr";
import { CurrentUserService } from "../current-user.service";

export class SignalrConnection{
    private hubConnection?: SignalR.HubConnection;
    private connectionClosed = true;
    private serverUrl: string = '';
  
    constructor(
      private currentUserService: CurrentUserService
    ){}

    public async start(url: string){
        this.serverUrl = url;

        await this.currentUserService.awaitInitialCheckCompleted();
        let authenticationKey = this.currentUserService.token ?? this.currentUserService.sessionId;
        
        this.hubConnection = new SignalR.HubConnectionBuilder()
        .withUrl(this.serverUrl, {
            accessTokenFactory: () => authenticationKey ?? ''
        })
        .build();

        await this.startConnection();
    }

    public async stop(){
        this.connectionClosed = true;
        await this.hubConnection?.stop();
    }

    public addEvent(methode: string, fn: (...args: any[]) => void){
        this.hubConnection?.on(methode, fn);
    }
    
    private async startConnection(restarting: boolean = false) {
      if(this.connectionClosed && restarting){
        return;
      }
  
      if(!this.connectionClosed && !restarting){
        await this.hubConnection?.stop();
      }
  
      this.connectionClosed = false;
  
      await this.hubConnection?.start()
        .then(() => {
          console.log('SignalR connection started');
        })
        .catch(err => console.log('Error while starting SignalR connection: ' + err));
  
      this.hubConnection?.onclose(() => {
        this.startConnection(true);
      });
    }
}