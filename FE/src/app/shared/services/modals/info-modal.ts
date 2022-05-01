export class InfoModal {
    public infoModalShown = false;
    public message?: string;
    public link?: string;

    show(message: string, link?: string) {
        this.infoModalShown = true;
        this.message = message;
        this.link = link;
    }

    close() {
        this.infoModalShown = false;
        this.message = undefined;
    }
}