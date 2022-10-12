import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { UsersService } from '../services/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterResponse } from '../responses/register.response';
import { UsersCenterEntity } from '../../users-center/entities/users-center.entity';
import { UserExistsPipe } from '../pipes/user.exists.pipe';
import { UsersRegisterDto } from '../dtos/users-register.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../users-center/enums/role.enum';
import { UserExistsByIdPipe } from '../pipes/user-exists-by-id.pipe';
import { CheckRoleExistsPipe } from '../pipes/check-role-exists.pipe';
import { ChangeRoleDto } from '../dtos/change-role.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCenterService: UsersCenterService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @RegisterResponse(UsersCenterEntity)
  async registerUser(
    @Body(UserExistsPipe) dto: UsersRegisterDto,
  ): Promise<UsersCenterEntity> {
    return await this.usersCenterService.register(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUser(@Param('id', UserExistsByIdPipe, ParseIntPipe) id: number) {
    return await this.usersCenterService.findUserById(id, {
      relations: ['tariffs', 'tariffs.tariff'],
    });
  }

  @Get(':id/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getUserHistory(
    @Param('id', UserExistsByIdPipe, ParseIntPipe) id: number,
  ) {
    return await this.usersService.getUserHistory(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUsers(@Query() query) {
    return await this.usersService.getUserByPag(query);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async changeRole(
    @Param('id', UserExistsByIdPipe, ParseIntPipe) id: number,
    @Body(CheckRoleExistsPipe) dto: ChangeRoleDto,
  ) {
    return await this.usersService.changeRole(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id', UserExistsByIdPipe, ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }
}
