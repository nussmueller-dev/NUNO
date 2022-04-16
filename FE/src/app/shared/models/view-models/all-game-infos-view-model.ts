import { PlayerViewModel } from 'src/app/shared/models/view-models/player-view-model';
import { GameCardViewModel } from './game-card-model';
export class AllGameInfosViewModel {
    public players: Array<PlayerViewModel> = [];
    public currentPlayer?: PlayerViewModel;
    public currentCard?: GameCardViewModel;
    public isReverseDirection: boolean = false;
    
    public myCards: Array<GameCardViewModel> = []; 
}
