import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { DeleteModal } from './modals/delete-modal';
import { ErrorModal } from './modals/error-modal';

@Injectable({
    providedIn: 'root'
})
export class PopupService {
    public deleteModal = new DeleteModal();
    public errorModal = new ErrorModal();

    constructor(
        private snackBar: MatSnackBar
    ){ }

    showSnackBar(text: string){
        this.snackBar.open(text, '', {
            duration: 2000,
            panelClass: 'snackbar'
        });
    }
}