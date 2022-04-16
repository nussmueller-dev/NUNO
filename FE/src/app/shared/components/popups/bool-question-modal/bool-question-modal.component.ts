import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { modalAnimation } from 'src/app/shared/animations/modal-animation';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-bool-question-modal',
  animations: [
    modalAnimation
  ],
  templateUrl: './bool-question-modal.component.html',
  styleUrls: ['./bool-question-modal.component.scss']
})
export class BoolQuestionModalComponent {
  holderElement?: HTMLElement;
  popupService: PopupService;

  @HostBinding('@hostShownHidden') get getShown(): string {
    return this.popupService.boolQuestionModal.modalShown ? 'shown' : 'hidden';
  }

  @HostListener('click', ['$event'])
  onMousUp(event: MouseEvent) {
    this.holderElement = document.getElementsByClassName('bool-question-popup-holder')[0] as HTMLElement;
    if (!this.holderElement.contains(event.target as HTMLElement) && document.contains(event.target as HTMLElement)) {
      this.cancel();
    }
  }

  @HostListener('window:keydown', ['$event']) 
  onKeydownToClose(event: KeyboardEvent) {
    if(event.code === 'Escape'){
      this.cancel();
    }
  }

  constructor(
    popupService: PopupService
  ) {
    this.popupService = popupService;
  }

  okay(){
    this.popupService.boolQuestionModal.okay();
  }

  cancel(){
    this.popupService.boolQuestionModal.cancel();
  }
}
