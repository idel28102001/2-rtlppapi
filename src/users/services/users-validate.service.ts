import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { Role } from '../../users-center/enums/role.enum';

@Injectable()
export class UsersValidateService {
  constructor(private readonly usersCenterService: UsersCenterService) {}

  checkRole(role: Role) {
    if (!Object.values(Role).includes(role))
      throw new BadRequestException('Можно менять на роль ADMIN или на USER');
  }

  async checkUserExistsByEmail(email: string) {
    const user = await this.usersCenterService.findByOpts({
      where: { email },
      select: ['id'],
    });
    if (user) {
      throw new ConflictException(
        'Данный адрес электронной почты уже зарегистрирован в системе',
      );
    }
    return true;
  }

  async checkUserExistsById(id: number) {
    if (!id) throw new BadRequestException();
    const user = await this.usersCenterService.findByOpts({
      where: { id },
      select: ['id'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return true;
  }
}
