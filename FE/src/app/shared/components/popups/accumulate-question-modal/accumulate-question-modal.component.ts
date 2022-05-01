import { Component, HostBinding } from '@angular/core';
import { modalAnimation } from 'src/app/shared/animations/modal-animation';
import { PopupService } from 'src/app/shared/services/popup.service';
import { GameCardViewModel } from './../../../models/view-models/game-card-model';

@Component({
  selector: 'app-accumulate-question-modal',
  animations: [
    modalAnimation
  ],
  templateUrl: './accumulate-question-modal.component.html',
  styleUrls: ['./accumulate-question-modal.component.scss']
})
export class AccumulateQuestionModalComponent {
  popupService: PopupService;

  @HostBinding('@hostShownHidden') get getShown(): string {
    return this.popupService.accumulateQuestionModal.modalShown ? 'shown' : 'hidden';
  }

  constructor(
    popupService: PopupService
  ) {
    this.popupService = popupService;
  }

  lay(card: GameCardViewModel) {
    this.popupService.accumulateQuestionModal.lay(card);
  }

  draw() {
    this.popupService.accumulateQuestionModal.draw();
  }
}
