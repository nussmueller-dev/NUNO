import { CurrentUserService } from './../../shared/services/current-user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent implements OnInit {

  constructor(
    private currentUserService: CurrentUserService
  ) { }

  ngOnInit() {
    this.currentUserService.checkAuthentication();
  }
}
