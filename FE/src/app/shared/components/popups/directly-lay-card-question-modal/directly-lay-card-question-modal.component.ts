import { Component, HostBinding } from '@angular/core';
import { modalAnimation } from 'src/app/shared/animations/modal-animation';
import { PopupService } from 'src/app/shared/services/popup.service';

@Component({
  selector: 'app-directly-lay-card-question-modal',
  animations: [
    modalAnimation
  ],
  templateUrl: './directly-lay-card-question-modal.component.html',
  styleUrls: ['./directly-lay-card-question-modal.component.scss']
})
export class DirectlyLayCardQuestionModalComponent {
  popupService: PopupService;

  @HostBinding('@hostShownHidden') get getShown(): string {
    return this.popupService.directlyLayCardQuestionModal.modalShown ? 'shown' : 'hidden';
  }

  constructor(
    popupService: PopupService
  ) {
    this.popupService = popupService;
  }

  yes() {
    this.popupService.directlyLayCardQuestionModal.yes();
  }

  no() {
    this.popupService.directlyLayCardQuestionModal.no();
  }
}
