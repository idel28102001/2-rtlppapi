import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersCenterService } from '../../users-center/services/users-center.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private usersCenterService: UsersCenterService) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unreachable code error
  async handleRequest(err, user) {
    const userData = await this.usersCenterService.findUserById(user.userId);
    return userData;
  }
}
