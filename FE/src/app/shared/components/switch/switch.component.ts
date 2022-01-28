import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  @Input() state = false;
  @Input() disabled = false;
  @Output() stateChange = new EventEmitter<boolean>();

  @HostBinding('class.disabled') disable: boolean = false;

  @HostListener('click') onClick() {
    if (!this.disabled) {
      this.state = !this.state;
      this.stateChange.emit(this.state);
    }
  }

  ngOnInit() {
    this.disable = this.disabled;

    if (this.disabled) {
      this.state = false;
    }
  }
}
