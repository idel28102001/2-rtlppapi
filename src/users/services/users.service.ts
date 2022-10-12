import { Injectable } from '@nestjs/common';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { UsersCenterEntity } from '../../users-center/entities/users-center.entity';
import { ChangeRoleDto } from '../dtos/change-role.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersCenterService: UsersCenterService) {}

  async save(data: any) {
    return (await this.usersCenterService.save(
      data,
    )) as any as UsersCenterEntity;
  }

  async getUserByPag(query) {
    return await this.usersCenterService.getUserByPag(query);
  }

  async getUserHistory(id: number) {
    const user = await this.usersCenterService.findUserById(id, {
      select: ['id'],
      relations: ['payments'],
    });
    return user.payments;
  }

  async changeRole(id: number, dto: ChangeRoleDto) {
    return await this.usersCenterService.changeRole(id, dto);
  }

  async deleteUser(id: number) {
    return await this.usersCenterService.deleteUser(id);
  }
}
