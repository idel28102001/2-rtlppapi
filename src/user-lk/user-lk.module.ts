import { Module } from '@nestjs/common';
import { UserLkController } from './controllers/user-lk.controller';
import { UserLkService } from './services/user-lk.service';
import { UsersCenterModule } from '../users-center/users-center.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersCenterModule, UsersModule],
  controllers: [UserLkController],
  providers: [UserLkService],
})
export class UserLkModule {}
