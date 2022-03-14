export class DeleteModal {
    public deleteModalShown = false;
    private promiseResolve: any;
    private shouldDelete = false;

    async openDeleteModal(): Promise<boolean>{
        this.deleteModalShown = true;

        await new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
        });

        this.deleteModalShown = false;
        
        return this.shouldDelete;
    }

    doDelete(){
        this.shouldDelete = true;
        this.promiseResolve();
    }

    dontDelete(){
        this.shouldDelete = false;
        this.promiseResolve();
    }
}