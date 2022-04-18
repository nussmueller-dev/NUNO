import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleType } from 'src/app/shared/constants/roles';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { PopupService } from 'src/app/shared/services/popup.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { UnoRulesBindingModel } from './../../shared/models/binding-models/uno-rules-binding-model';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  isOwner = false;
  rules: UnoRulesBindingModel = new UnoRulesBindingModel();

  constructor(
    private currentUserService: CurrentUserService,
    private sessionService: SessionService,
    private popupService: PopupService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isOwner = this.currentUserService.role === RoleType.Owner;
  }

  async next() {
    if (this.rules.startCardCount < 2 || this.rules.startCardCount > 20) {
      this.popupService.errorModal.show('Die Anzahl Karten beim Spielstart muss zwischen 2 und 20 liegen');
      return;
    }

    await this.currentUserService.checkAuthentication();

    let sessionId = await this.sessionService.createUnoSession(this.rules);

    this.router.navigate(['/manage-players'], { queryParams: { sessionId: sessionId } });
  }

  showInfo(message: string) {
    this.popupService.infoModal.show(message);
  }
}
