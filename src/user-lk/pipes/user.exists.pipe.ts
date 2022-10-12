import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly usersCenterService: UsersCenterService) {}

  async transform(userPayload: UserPayloadInterface) {
    const user = await this.usersCenterService.findUserById(
      userPayload.userId,
      {
        select: ['id'],
      },
    );
    if (!user) {
      throw new BadRequestException('Данного аккаунта не существует');
    }
    return userPayload;
  }
}
