import { Module } from '@nestjs/common';
import { TariffService } from './services/tariff.service';
import { TariffController } from './controllers/tariff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TariffsEntity } from './entities/tariffs.entity';
import { SubTariffEntity } from './entities/sub-tariff.entity';
import { TariffUserEntity } from './entities/tariff-user.entity';
import { UsersCenterModule } from '../users-center/users-center.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TariffsEntity,
      SubTariffEntity,
      TariffUserEntity,
    ]),
    UsersCenterModule,
    PaymentsModule,
  ],
  providers: [TariffService],
  controllers: [TariffController],
  exports: [TariffService],
})
export class TariffModule {}
