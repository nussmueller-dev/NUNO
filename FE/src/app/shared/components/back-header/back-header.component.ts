import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-header',
  templateUrl: './back-header.component.html',
  styleUrls: ['./back-header.component.scss']
})
export class BackHeaderComponent {
  @Input() backUrl?: string;
  @Input() clearQueryParams: boolean = false;
  @Output() navigateBack: EventEmitter<void> = new EventEmitter();

  constructor(
    private router: Router
  ){}

  navBack(){
    this.navigateBack.emit();
    this.router.navigate([this.backUrl],  { queryParamsHandling: this.clearQueryParams ? '' : 'merge' });
  }
}
