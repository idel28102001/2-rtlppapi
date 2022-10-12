import { Role } from '../../users-center/enums/role.enum';

export interface UserPayloadInterface {
  username: string;
  roles: Role[];
  userId: number;
  telegramSession: string;
  phone: string;
}
