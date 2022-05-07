import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  targetNavigationPoint?: string;
  canLogin = true;

  constructor(
    private authenticationService: AuthenticationService,
    private popupService: PopupService,
    private currentUserService: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.targetNavigationPoint = this.route.snapshot.queryParamMap.get('method') ?? undefined;

    if (this.targetNavigationPoint !== 'join' && this.targetNavigationPoint !== 'create') {
      this.router.navigate(['/welcome']);
    }
  }

  async login() {
    if (!this.canLogin) {
      return;
    }

    this.canLogin = false;

    let authenticationViewModel = await this.authenticationService.login(this.username, this.password).catch((e: any) => {
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

    if (authenticationViewModel) {
      this.currentUserService.setCurrentUser(authenticationViewModel);

      if (this.targetNavigationPoint === 'join') {
        this.router.navigate(['/join']);
      } else {
        this.router.navigate(['/rules']);
      }
    }

    this.canLogin = true;
  }
}
