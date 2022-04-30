import { Component, Input, OnInit } from '@angular/core';
import { PlayerViewModel } from './../../models/view-models/player-view-model';
import { CurrentUserService } from './../../services/current-user.service';

@Component({
  selector: 'app-podium-place',
  templateUrl: './podium-place.component.html',
  styleUrls: ['./podium-place.component.scss']
})
export class PodiumPlaceComponent implements OnInit {
  @Input() player?: PlayerViewModel;
  @Input() rank?: number;

  meUserName?: string;

  constructor(private currentUserService: CurrentUserService) { }

  ngOnInit() {
    this.meUserName = this.currentUserService.username;
  }
}
