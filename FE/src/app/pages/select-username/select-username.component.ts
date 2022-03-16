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
