import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-header',
  templateUrl: './back-header.component.html',
  styleUrls: ['./back-header.component.scss']
})
export class BackHeaderComponent {
  @Input() backUrl?: string;

  constructor(
    private router: Router
  ){}

  navBack(){
    this.router.navigate([this.backUrl],  { queryParamsHandling: 'merge' });
  }
}
