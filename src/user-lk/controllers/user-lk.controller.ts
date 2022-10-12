import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserLkService } from '../services/user-lk.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users-center/enums/role.enum';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';
import { UserPayloadDecorator } from '../../auth/decorators/user-payload.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserExistsPipe } from '../pipes/user.exists.pipe';

@ApiTags('User-lk')
@Controller('user-lk')
export class UserLkController {
  constructor(private readonly userlkService: UserLkService) {}

  @Get('history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getUserHistory(
    @UserPayloadDecorator(UserExistsPipe) userPayload: UserPayloadInterface,
  ) {
    return await this.userlkService.getUserHistory(userPayload);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getUserInfo(
    @UserPayloadDecorator(UserExistsPipe) userPayload: UserPayloadInterface,
  ) {
    return await this.userlkService.getUserInfo(userPayload);
  }
}
