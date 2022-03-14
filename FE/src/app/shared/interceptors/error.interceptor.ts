import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { PopupService } from "../services/popup.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(
        private popupService: PopupService
    ){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status < 400 || error.status >= 500){
                    this.popupService.errorModal.showErrorMessage('Etwas ist schief gelaufen!');
                }

                return throwError(error);
            })
        )
    }

}