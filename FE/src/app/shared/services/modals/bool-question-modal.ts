export class BoolQuestionModal {
    public modalShown = false;
    public question = '';
    public acceptButtonText: string | null = null;
    public buttonColorRed = false;
    private promiseResolve: any;
    private answer = false;

    async show(question: string, acceptButtonText: string | null = null, acceptButtonRed = false): Promise<boolean> {
        this.modalShown = true;
        this.question = question;
        this.acceptButtonText = acceptButtonText;
        this.buttonColorRed = acceptButtonRed;

        await new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
        });

        this.modalShown = false;

        return this.answer;
    }

    okay() {
        if (this.promiseResolve) {
            this.answer = true;
            this.promiseResolve();
        }
    }

    cancel() {
        if (this.promiseResolve) {
            this.answer = false;
            this.promiseResolve();
        }
    }
}