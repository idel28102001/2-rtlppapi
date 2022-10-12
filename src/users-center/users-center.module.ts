import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersCenterEntity } from './entities/users-center.entity';
import { UsersCenterService } from './services/users-center.service';

@Module({
  imports: [UsersCenterModule, TypeOrmModule.forFeature([UsersCenterEntity])],
  providers: [UsersCenterService],
  exports: [UsersCenterService],
})
export class UsersCenterModule {}
