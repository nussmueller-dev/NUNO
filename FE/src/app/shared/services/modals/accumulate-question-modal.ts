import { GameCardViewModel } from '../../models/view-models/game-card-model';

export class AccumulateQuestionModal {
    public modalShown = false;
    public possibleCards?: Array<GameCardViewModel>;
    private promiseResolve: any;
    private answer?: GameCardViewModel;

    async show(possibleCards: Array<GameCardViewModel>): Promise<GameCardViewModel | undefined> {
        this.modalShown = true;
        this.possibleCards = possibleCards;

        await new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
        });

        this.modalShown = false;

        return this.answer;
    }

    lay(card: GameCardViewModel) {
        if (this.promiseResolve) {
            this.answer = card;
            this.promiseResolve();
        }
    }

    draw() {
        if (this.promiseResolve) {
            this.answer = undefined;
            this.promiseResolve();
        }
    }
}