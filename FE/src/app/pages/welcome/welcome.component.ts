import { SignalrService } from './../../shared/services/signalr.service';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  currentUserService: CurrentUserService;

  constructor(
    currentUserService: CurrentUserService,
    private signalrService: SignalrService
  ) {
    this.currentUserService = currentUserService;
    signalrService.startConnection();
  }

  logout(){
    this.currentUserService.logout();
  }
}
