import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersValidateService } from './services/users-validate.service';
import { UsersCenterModule } from '../users-center/users-center.module';

@Module({
  imports: [UsersCenterModule],
  providers: [UsersService, UsersValidateService],
  controllers: [UsersController],
  exports: [UsersService, UsersValidateService],
})
export class UsersModule {}
