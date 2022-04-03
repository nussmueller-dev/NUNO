import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-leave-header',
  templateUrl: './leave-header.component.html',
  styleUrls: ['./leave-header.component.scss']
})
export class LeaveHeaderComponent {
  @Output() leave: EventEmitter<void> = new EventEmitter();

  onLeave(){
    this.leave.emit();
  }
}
