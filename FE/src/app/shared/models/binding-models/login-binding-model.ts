export class LoginBindingModel {
    username: string;
    password: string;

    public constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }
}
