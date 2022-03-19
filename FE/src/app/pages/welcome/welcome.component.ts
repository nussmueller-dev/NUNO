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
    currentUserService: CurrentUserService
  ) {
    this.currentUserService = currentUserService;
  }

  logout(){
    this.currentUserService.logout();
  }
}
