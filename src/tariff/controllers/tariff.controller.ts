import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TariffService } from '../services/tariff.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TariffsDto } from '../dtos/tariffs.dto';
import { TariffsEditDto } from '../dtos/tariffs.edit.dto';
import { Role } from '../../users-center/enums/role.enum';
import { UserPayloadDecorator } from '../../auth/decorators/user-payload.decorator';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';
import { TariffExistPipe } from '../pipes/exist.channelId.pipe';

@Controller('tariff')
@ApiTags('Tariff')
export class TariffController {
  constructor(private readonly tariffService: TariffService) {}

  @Get()
  async getAllTariffs() {
    return await this.tariffService.getAllTariffs();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  async createTariff(@Body() tariffs: TariffsDto) {
    return await this.tariffService.createTariff(tariffs);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('buy/:id')
  async buyTariff(
    @UserPayloadDecorator() userPayload: UserPayloadInterface,
    @Param('id', ParseIntPipe, TariffExistPipe) id: number,
  ) {
    return await this.tariffService.buyTariff(userPayload, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('edit/:id')
  async editTariff(
    @Body() tariffs: TariffsEditDto,
    @Param('id', ParseIntPipe, TariffExistPipe) id: number,
  ) {
    return await this.tariffService.editTariff(id, tariffs);
  }
}
