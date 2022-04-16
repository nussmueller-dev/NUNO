import { CardType } from '../../constants/card-types';
import { Color } from './../../constants/colors';
export class GameCardViewModel {
    id: number = 0;
    cardType: CardType = CardType.Number;

    color?: Color;
    number?: number;

    cantLayThisCardCount = 0;
}
