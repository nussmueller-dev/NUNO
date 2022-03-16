import { RoleType } from './../../constants/roles';
export class TempUserViewModel {
    sessionId: string = '';
    username: string = '';
    role: RoleType = RoleType.TempUser;
}
