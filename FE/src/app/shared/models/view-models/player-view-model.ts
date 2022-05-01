import { GameCardViewModel } from './game-card-model';
export class PlayerViewModel {
    username: string = '';
    calledLastCard: boolean = false;
    takenLayableCard?: GameCardViewModel;
    couldLayDrawFourCard?: boolean;
    couldLayDrawTwoCard?: boolean;
    points: number = 0;
    cardsCount: number = 0;
}
