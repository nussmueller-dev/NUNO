import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CurrentUserService } from './shared/services/current-user.service';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from './shared/routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit { 
  constructor(
    private currentUserService: CurrentUserService
  ){ }

  ngOnInit() {
    this.currentUserService.tryReAuthentication();
  }
}
