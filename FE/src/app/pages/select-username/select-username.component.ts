import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-username',
  templateUrl: './select-username.component.html',
  styleUrls: ['./select-username.component.scss']
})
export class SelectUsernameComponent implements OnInit {
  targetNavigationPoint?: string;

  constructor(
    private currentUserService: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.targetNavigationPoint = this.route.snapshot.queryParamMap.get('method') ?? undefined;

    if(this.targetNavigationPoint !== 'join' && this.targetNavigationPoint !== 'create'){
      this.router.navigate(['/welcome']);
    }

    if(this.currentUserService.userIsAuthorized){
      if(this.targetNavigationPoint === 'join'){
        this.router.navigate(['/join']);
      }else{
        this.router.navigate(['/rules']);
      }
    }
  }
}
