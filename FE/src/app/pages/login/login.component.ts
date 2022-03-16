import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  targetNavigationPoint?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.targetNavigationPoint = this.route.snapshot.queryParamMap.get('method') ?? undefined;

    if(this.targetNavigationPoint !== 'join' && this.targetNavigationPoint !== 'create'){
      this.router.navigate(['/welcome']);
    }
  }

}
