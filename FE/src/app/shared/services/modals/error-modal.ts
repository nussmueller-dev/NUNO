export class ErrorModal {
    public errorModalShown = false;
    public message?: string;

    show(message: string){
        this.errorModalShown = true;
        this.message = message;
    }

    close(){
        this.errorModalShown = false;
        this.message = undefined;
    }
}