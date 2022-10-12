import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { TariffsEntity } from '../entities/tariffs.entity';
import { TariffUserEntity } from '../entities/tariff-user.entity';
import { SubTariffEntity } from '../entities/sub-tariff.entity';
import { PaymentsService } from '../../payments/services/payments.service';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { UsersCenterEntity } from '../../users-center/entities/users-center.entity';
import { TariffsDto } from '../dtos/tariffs.dto';
import { CreateChargeDto } from '../../payments/dtos/create-charge.dto';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';
import { TariffsEditDto } from '../dtos/tariffs.edit.dto';
import { addDays, addMonths, compareAsc } from 'date-fns';

@Injectable()
export class TariffService {
  constructor(
    @InjectRepository(SubTariffEntity)
    private readonly subTariffRepo: Repository<SubTariffEntity>,
    @InjectRepository(TariffsEntity)
    private readonly tariffsRepo: Repository<TariffsEntity>,
    @InjectRepository(TariffUserEntity)
    private readonly tariffsUserRepo: Repository<TariffUserEntity>,
    private readonly paymentsService: PaymentsService,
    private readonly userCenterService: UsersCenterService,
  ) {}

  async addTariffToUser(user: UsersCenterEntity, tariffId: number) {
    const tariff = await this.subTariffRepo.findOne({
      where: { id: tariffId },
      relations: ['tariffs'],
    });
    if (user.onetimewas) {
      if (tariff.tariffs.oneTime) {
        throw new BadRequestException('У пользователя уже был пробный период');
      }
    }
    const tariffUser = user.tariffs;
    const tariffElem =
      tariffUser.find((e) => e.tariff.id === tariffId) ||
      this.tariffsUserRepo.create({ tariff: tariff.tariffs, user });
    const toDate = this.addDate(new Date(), tariff.duration);
    const expiresAt = new Date(tariffElem.expiresAt || Date.now());
    if (compareAsc(expiresAt, new Date()) === 1) {
      tariffElem.expiresAt = this.addDate(expiresAt, tariff.duration);
    } else {
      tariffElem.expiresAt = toDate;
    }
    if (tariffElem?.tariff?.oneTime) {
      user.onetimewas = true;
      const { tariffs, ...rest } = user;
      await this.userCenterService.update(user.id, rest);
    }
    const { tariffs, ...userRest } = user;
    tariffElem.user = userRest as any;
    return await this.tariffsUserRepo.save(tariffElem);
  }

  addDate(date: Date, num: number) {
    if (num > 29) {
      return addMonths(date, Math.round(num / 30));
    } else {
      return addDays(date, num);
    }
  }

  async findById(id: number, options?: FindOneOptions<TariffsEntity>) {
    return await this.tariffsRepo.findOne({ ...{ where: { id } }, ...options });
  }

  async getAllTariffs() {
    return await this.tariffsRepo.find({ relations: ['tariffs'] });
  }
  async editTariff(id: number, dto: TariffsEditDto) {
    const tariff = await this.tariffsRepo.findOne({ where: { id } });
    return await this.tariffsRepo.update(id, tariff);
  }

  async buyTariff(userPayload: UserPayloadInterface, id: number) {
    const tariff = await this.subTariffRepo.findOne({
      where: { id },
      relations: ['tariffs'],
    });
    const user = await this.userCenterService.findUserById(userPayload.userId, {
      relations: ['tariffs', 'tariffs.tariff'],
    });
    if (tariff.cost > 0) {
      const createChargeDto = new CreateChargeDto();
      createChargeDto.name = tariff.tariffs.name;
      createChargeDto.description = tariff.id.toString();
      createChargeDto.amount = tariff.cost.toString();
      createChargeDto.currency = tariff.currency;
      return await this.paymentsService.createCharge(
        createChargeDto,
        userPayload,
      );
    } else {
      return await this.addTariffToUser(user, id);
    }
  }

  async createTariff(tariff: TariffsDto) {
    const tariffsEnt = this.subTariffRepo.create(tariff.tariffs);
    const tariffs = await this.subTariffRepo.save(tariffsEnt);
    try {
      return await this.tariffsRepo.save({
        name: tariff.name,
        oneTime: tariff.oneTime,
        accessLevel: tariff.accessLevel,
        tariffs,
      });
    } catch (e) {
      throw new BadRequestException(
        `У вас уже есть тариф с названием - ${tariff.name}`,
      );
    }
  }
}
