export class Rule {
    selected: boolean = false;
    name?: string;
    description?: string;
    defaultOn: boolean = false;
    ownerOnly: boolean = false;

    public constructor(name: string = '', description: string = '', defaultOn: boolean = false, ownerOnly: boolean = false){
        this.name = name;
        this.description = description;
        this.defaultOn = defaultOn;
        this.ownerOnly = ownerOnly;
    }
}
