import { Component, HostBinding, HostListener } from '@angular/core';
import { modalAnimation } from 'src/app/shared/animations/modal-animation';
import { Color } from '../../../constants/colors';
import { PopupService } from '../../../services/popup.service';

@Component({
  selector: 'app-select-color',
  animations: [
    modalAnimation
  ],
  templateUrl: './select-color-modal.component.html',
  styleUrls: ['./select-color-modal.component.scss']
})
export class SelectColorComponent {
  colors = Color;
  popupService: PopupService;
  holderElement?: HTMLElement;

  @HostBinding('@hostShownHidden') get getShown(): string {
    return this.popupService.selectColorModal.modalShown ? 'shown' : 'hidden';
  }

  @HostListener('click', ['$event'])
  onMousUp(event: MouseEvent) {
    this.holderElement = document.getElementsByClassName('select-color-popup-holder')[0] as HTMLElement;
    if (!this.holderElement.contains(event.target as HTMLElement) && document.contains(event.target as HTMLElement)) {
      this.cancel();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydownToClose(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.cancel();
    }
  }

  constructor(popupService: PopupService) {
    this.popupService = popupService;
  }

  selectedColor(color: Color) {
    this.popupService.selectColorModal.selectedColor(color);
  }

  cancel() {
    this.popupService.selectColorModal.cancel();
  }
}
