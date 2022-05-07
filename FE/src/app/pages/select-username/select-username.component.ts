import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-select-username',
  templateUrl: './select-username.component.html',
  styleUrls: ['./select-username.component.scss']
})
export class SelectUsernameComponent implements OnInit {
  tempUserName: string = '';
  targetNavigationPoint?: string;

  canCreateTempUser = true;

  constructor(
    private currentUserService: CurrentUserService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router
  ) { }

  ngOnInit() {
    this.targetNavigationPoint = this.route.snapshot.queryParamMap.get('method') ?? undefined;

    if (this.targetNavigationPoint !== 'join' && this.targetNavigationPoint !== 'create') {
      this.router.navigate(['/welcome']);
      return;
    }

    if (this.currentUserService.userIsAuthorized) {
      if (this.targetNavigationPoint === 'join') {
        this.router.navigate(['/join']);
      } else {
        this.router.navigate(['/rules']);
      }
    }
  }

  async createTempUser() {
    if (!this.canCreateTempUser) {
      return;
    }

    this.canCreateTempUser = false;

    let tempUserViewModel = await this.authenticationService.createTempUser(this.tempUserName).catch((e: any) => {
      let errorMessage = '';

      for (let key in e.error.errors) {
        errorMessage += e.error.errors[key][0] + '\n';
      }

      if (e.error.message) {
        errorMessage = e.error.message;
      }

      if (errorMessage.length === 0) {
        errorMessage = 'Es ist etwas schiefgelaufen'
      }

      this.popupService.errorModal.show(errorMessage);
    });

    if (tempUserViewModel) {
      this.currentUserService.setCurrentTempUser(tempUserViewModel);

      if (this.targetNavigationPoint === 'join') {
        this.router.navigate(['/join']);
      } else {
        this.router.navigate(['/rules']);
      }
    }

    this.canCreateTempUser = true;
  }
}
