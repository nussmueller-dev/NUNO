import { GameCardViewModel } from './game-card-model';
export class PlayerViewModel {
    username: string = '';
    calledLastCard: boolean = false;
    takenLayableCard?: GameCardViewModel;
    points: number = 0;
    cardsCount: number = 0;
}
