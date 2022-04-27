import { Component, HostListener, OnInit } from '@angular/core';
import { routerTransition } from './shared/routes';
import { CurrentUserService } from './shared/services/current-user.service';
import { EasterEggService } from './shared/services/easter-egg.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  easterEggService: EasterEggService;

  constructor(
    private currentUserService: CurrentUserService,
    easterEggService: EasterEggService
  ) {
    this.easterEggService = easterEggService;
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    this.easterEggService.keyPressed(event.key);
  }

  ngOnInit() {
    this.currentUserService.tryReAuthentication();
  }
}
