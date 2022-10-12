import { Inject, NotFoundException, ValidationPipe } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TariffService } from '../services/tariff.service';

export class TariffExistPipe extends ValidationPipe {
  constructor(
    @Inject(REQUEST) public request: any,
    private readonly tariffService: TariffService,
  ) {
    super({
      transform: true,
    });
  }

  async transform(id) {
    const tariff = await this.tariffService.findById(id, { select: ['id'] });

    if (!tariff) {
      throw new NotFoundException('Тариф не найден в базе');
    }

    return id;
  }
}
