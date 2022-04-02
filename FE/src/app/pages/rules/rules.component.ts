import { Router } from '@angular/router';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { UnoRulesBindingModel } from './../../shared/models/binding-models/uno-rules-binding-model';
import { Component, OnInit } from '@angular/core';
import { RoleType } from 'src/app/shared/constants/roles';
import { SessionService } from 'src/app/shared/services/session.service';

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
    private router: Router
  ){}
  
  ngOnInit() {
    this.isOwner = this.currentUserService.role === RoleType.Owner;
  }

  async next(){
    await this.currentUserService.checkAuthentication();
    
    let sessionId = await this.sessionService.createUnoSession(this.rules);

    this.router.navigate(['/manage-players'],  { queryParams: { sessionId: sessionId } });
  }

  showInfo(message: string){
    
  }
}
