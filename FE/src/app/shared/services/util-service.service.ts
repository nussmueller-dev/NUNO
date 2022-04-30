import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionState } from '../constants/session-states';

@Injectable({
  providedIn: 'root'
})
export class UtilServiceService {
  constructor(
    private router: Router
  ) { }

  reactToSessionState(sessionState: SessionState | void, wishedSessionState: SessionState, isCreator: boolean) {
    if (sessionState === wishedSessionState) {
      return;
    }

    switch (sessionState) {
      case SessionState.ManagePlayers:
        if (isCreator) {
          this.router.navigate(['/manage-players'], { queryParamsHandling: 'merge' });
        } else {
          this.router.navigate(['/waiting'], { queryParamsHandling: 'merge' });
        }
        break;
      case SessionState.Play:
        this.router.navigate(['/play'], { queryParamsHandling: 'merge' });
        break;
      case SessionState.ShowResults:
        this.router.navigate(['/stats'], { queryParamsHandling: 'merge' });
        break;
    }
  }
}
