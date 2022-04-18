import { Color } from "../../constants/colors";

export class SelectColorModal {
    public modalShown = false;
    private promiseResolve: any;
    private answer: Color | null = null;

    async show(): Promise<Color | null> {
        this.modalShown = true;

        await new Promise((resolve, reject) => {
            this.promiseResolve = resolve;
        });

        this.modalShown = false;

        return this.answer;
    }

    selectedColor(color: Color) {
        if (this.promiseResolve) {
            this.answer = color;
            this.promiseResolve();
        }
    }

    cancel() {
        if (this.promiseResolve) {
            this.answer = null;
            this.promiseResolve();
        }
    }
}