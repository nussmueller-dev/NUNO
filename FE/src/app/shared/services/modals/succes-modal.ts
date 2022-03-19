export class SuccesModal {
    public succesModalShown = false;
    public message?: string;

    showSuccesMessage(message: string){
        this.succesModalShown = true;
        this.message = message;
    }

    close(){
        this.succesModalShown = false;
        this.message = undefined;
    }
}