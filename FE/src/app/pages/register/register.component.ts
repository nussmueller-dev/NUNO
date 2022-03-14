import { PopupService } from './../../shared/services/popup.service';
import { AuthenticationService } from './../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
  }

  async register(){
    let authenticationViewModel = await this.authenticationService.register(this.username, this.email, this.password).catch((e: any) => {
      let errorMessage = '';

      for(let key in e.error.errors){
        errorMessage += e.error.errors[key][0] + '\n';
      }

      console.log(errorMessage);

      this.popupService.errorModal.showErrorMessage(errorMessage);
    });

    console.log(authenticationViewModel);
    console.log('Register');
  }
}
