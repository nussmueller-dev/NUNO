import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BoolQuestionModal } from './modals/bool-question-modal';
import { ErrorModal } from './modals/error-modal';
import { InfoModal } from './modals/info-modal';
import { SelectColorModal } from './modals/select-color-modal';
import { SuccesModal } from './modals/succes-modal';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    public errorModal = new ErrorModal();
    public succesModal = new SuccesModal();
    public boolQuestionModal = new BoolQuestionModal();
    public selectColorModal = new SelectColorModal();
    public infoModal = new InfoModal();

    constructor(
        private snackBar: MatSnackBar
    ) { }

    showSnackBar(text: string) {
        this.snackBar.open(text, '', {
            duration: 2000,
            panelClass: 'snackbar'
        });
    }
}