import { Module } from '@nestjs/common';
import { UsersCenterModule } from './users-center/users-center.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './common/config';
import { WebhooksModule } from './webhooks/webhooks.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { TariffModule } from './tariff/tariff.module';
import { UserLkModule } from './user-lk/user-lk.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => config.getDatabaseOptions(),
    }),
    UsersModule,
    UserLkModule,
    TariffModule,
    PaymentsModule,
    EventsModule,
    AuthModule,
    WebhooksModule,
    UsersCenterModule,
  ],
})
export class AppModule {}
