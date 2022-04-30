import { GameCardViewModel } from './../../models/view-models/game-card-model';

export class DirectlyLayCardQuestionModal {
    public modalShown = false;
    public card?: GameCardViewModel;
    private promiseResolve: any;
    private answer = false;

    async show(card: GameCardViewModel): Promise<boolean> {
        this.modalShown = true;
        this.card = card;

        await new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
        });

        this.modalShown = false;

        return this.answer;
    }

    yes() {
        if (this.promiseResolve) {
            this.answer = true;
            this.promiseResolve();
        }
    }

    no() {
        if (this.promiseResolve) {
            this.answer = false;
            this.promiseResolve();
        }
    }
}