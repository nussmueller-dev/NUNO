export class InfoModal {
    public infoModalShown = false;
    public message?: string;

    show(message: string) {
        this.infoModalShown = true;
        this.message = message;
    }

    close() {
        this.infoModalShown = false;
        this.message = undefined;
    }
}