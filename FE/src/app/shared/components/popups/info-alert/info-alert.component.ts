import { Component, HostBinding, HostListener } from '@angular/core';
import { modalAnimation } from 'src/app/shared/animations/modal-animation';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-info-alert',
  animations: [
    modalAnimation
  ],
  templateUrl: './info-alert.component.html',
  styleUrls: ['./info-alert.component.scss']
})
export class InfoAlertComponent {
  holderElement?: HTMLElement;
  popupService: PopupService;

  @HostBinding('@hostShownHidden') get getShown(): string {
    return this.popupService.infoModal.infoModalShown ? 'shown' : 'hidden';
  }

  @HostListener('click', ['$event'])
  onMousUp(event: MouseEvent) {
    this.holderElement = document.getElementsByClassName('info-popup-holder')[0] as HTMLElement;
    if (!this.holderElement.contains(event.target as HTMLElement) && document.contains(event.target as HTMLElement)) {
      this.close();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydownToClose(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.close();
    }
  }

  constructor(
    popupService: PopupService
  ) {
    this.popupService = popupService;
  }

  close() {
    this.popupService.infoModal.close();
  }
}
