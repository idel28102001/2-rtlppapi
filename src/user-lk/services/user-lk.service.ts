import { Injectable } from '@nestjs/common';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';
import { isPast } from 'date-fns';
import { compareAccess } from '../../common/utils';

@Injectable()
export class UserLkService {
  constructor(private readonly usersCenterService: UsersCenterService) {}
  async getUserHistory(userPayload: UserPayloadInterface) {
    const user = await this.usersCenterService.findUserById(
      userPayload.userId,
      {
        relations: ['payments'],
        select: ['id'],
      },
    );
    return user.payments;
  }

  async getUserInfo(userPayload: UserPayloadInterface) {
    const { tariffs, ...rest } = await this.usersCenterService.findUserById(
      userPayload.userId,
      {
        relations: ['tariffs', 'tariffs.tariff'],
      },
    );
    const tariff = tariffs
      .filter((e) => !isPast(new Date(`${e.expiresAt} 23:59:59`)))
      .sort(compareAccess)[0];
    return { ...rest, tariff };
  }
}
