export class RegisterBindingModel {
    username: string;
    email: string;
    password: string;

    public constructor(username: string, email: string, password: string){
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
