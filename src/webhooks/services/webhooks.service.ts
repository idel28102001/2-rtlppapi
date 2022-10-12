import { Injectable } from '@nestjs/common';
import { PaymentsService } from '../../payments/services/payments.service';
import { PaymentsEnums } from '../../payments/enums/payments.enums';
import { TariffService } from '../../tariff/services/tariff.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly tariffService: TariffService,
  ) {}

  async changeStatus(data) {
    const id = data.id;
    const [currType, status] = data.event.type.split(':');
    switch (currType) {
      case 'charge': {
        return await this.repStatus(id, status);
      }
    }
  }

  async repStatus(id, status) {
    const result = await this.paymentsService.findWithOpts({
      select: ['id', 'status', 'paymentId', 'description'],
      where: { paymentId: id },
      relations: ['user', 'user.tariffs', 'user.tariffs.tariff'],
    });
    if (result) {
      result.status = PaymentsEnums[status.toUpperCase()];
      const { user, ...rest } = result;
      await this.paymentsService.save(rest);
      if (result.status === PaymentsEnums.CONFIRMED) {
        console.log(result.status);
        return await this.tariffService.addTariffToUser(
          user,
          Number(result.description),
        );
      }
    }
  }
}
