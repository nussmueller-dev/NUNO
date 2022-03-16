import { RoleType } from './../../constants/roles';
export class AuthenticationViewModel {
    id: number = 0;
    username: string = '';
    role: RoleType = RoleType.Player;
    email: string = '';
    token: string = '';
}
