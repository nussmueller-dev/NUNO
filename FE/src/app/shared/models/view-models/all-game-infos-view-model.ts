import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { SessionState } from './../../constants/session-states';
import { GameCardViewModel } from './game-card-model';
import { RulesViewModel } from './rules-view-model';
export class AllGameInfosViewModel {
    public rules?: RulesViewModel;
    public players: Array<PlayerViewModel> = [];
    public currentPlayer?: PlayerViewModel;
    public currentCard?: GameCardViewModel;
    public isReverseDirection: boolean = false;

    public sessionCreator?: PlayerViewModel;
    public sessionState: SessionState = SessionState.Play;

    public myCards: Array<GameCardViewModel> = [];
}
