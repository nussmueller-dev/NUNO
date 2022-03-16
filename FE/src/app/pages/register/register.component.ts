import { CurrentUserService } from './../../shared/services/current-user.service';
import { PopupService } from './../../shared/services/popup.service';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';

  targetNavigationPoint?: string;

  constructor(
    private authenticationService: AuthenticationService,
    private popupService: PopupService,
    private CurrentUserService: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.targetNavigationPoint = this.route.snapshot.queryParamMap.get('method') ?? undefined;

    if(this.targetNavigationPoint !== 'join' && this.targetNavigationPoint !== 'create'){
      this.router.navigate(['/welcome']);
    }
  }

  async register(){
    let authenticationViewModel = await this.authenticationService.register(this.username, this.email, this.password).catch((e: any) => {
      let errorMessage = '';

      for(let key in e.error.errors){
        errorMessage += e.error.errors[key][0] + '\n';
      }

      if(errorMessage.length === 0){
        errorMessage = 'Es ist etwas schiefgelaufen'
      }

      this.popupService.errorModal.showErrorMessage(errorMessage);
    });

    if(authenticationViewModel){
      this.CurrentUserService.setCurrentUser(authenticationViewModel);

      if(this.targetNavigationPoint === 'join'){
        this.router.navigate(['/join']);
      }else{
        this.router.navigate(['/rules']);
      }
    }
  }
}
