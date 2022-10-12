import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { UsersCenterModule } from '../users-center/users-center.module';
import { applyRawBodyOnlyTo } from '@golevelup/nestjs-webhooks';
import { TariffModule } from '../tariff/tariff.module';
import { WebhooksService } from './services/webhooks.service';
import { WebhooksController } from './controllers/webhooks.controller';

@Module({
  imports: [PaymentsModule, UsersCenterModule, TariffModule],
  providers: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'webhook',
    });
  }
}
