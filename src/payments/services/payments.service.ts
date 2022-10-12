import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChargeDto } from '../dtos/create-charge.dto';
import { PaymentEntity } from '../entities/payment.entity';
import * as coinbase from 'coinbase-commerce-node';
import { PaymentsEnums } from '../enums/payments.enums';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';

@Injectable()
export class PaymentsService {
  private readonly Client = coinbase.Client;
  private readonly Checkout = coinbase.resources.Checkout;
  private readonly Charge = coinbase.resources.Charge;
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    private readonly usersCenterService: UsersCenterService,
  ) {
    (async () => {
      await this.Client.init(process.env.COIN_API);
    })();
  }

  async findWithOpts(options: FindOneOptions<PaymentEntity>) {
    return await this.paymentRepo.findOne(options);
  }

  async save(data) {
    return await this.paymentRepo.save(data);
  }

  async getHistory(userPayload: UserPayloadInterface) {
    const user = await this.usersCenterService.findUserById(
      userPayload.userId,
      {
        select: ['id'],
        relations: ['payments'],
      },
    );
    return user.payments;
  }

  async createCharge(dto: CreateChargeDto, userPayload: UserPayloadInterface) {
    const user = await this.usersCenterService.findUserById(
      userPayload.userId,
      {
        select: ['id'],
        relations: ['payments'],
      },
    );
    const { name, description, currency, amount } = dto;
    let result: PaymentEntity;
    await this.Charge.create(
      {
        description,
        local_price: { amount, currency },
        name,
        pricing_type: 'fixed_price',
      },
      async (err, res) => {
        if (res) {
          result = this.createEntity(
            dto,
            res.hosted_url,
            res.expires_at,
            res.id,
          );
          result.user = user;
          await this.paymentRepo.save(result);
        }
      },
    ).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (result) {
      return { redirectUrl: result.redirectUrl };
    }
  }

  createEntity(
    dto: CreateChargeDto,
    url: string,
    expiresAt,
    paymentId,
  ): PaymentEntity {
    return this.paymentRepo.create({
      ...dto,
      redirectUrl: url,
      expiresAt,
      paymentId: paymentId,
      status: PaymentsEnums.CREATED,
    });
  }
}
