import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { Role } from '../../users-center/enums/role.enum';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateChargeDto } from '../dtos/create-charge.dto';
import { UserPayloadDecorator } from '../../auth/decorators/user-payload.decorator';
import { UserPayloadInterface } from '../../auth/interfaces/user-payload.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('create')
  async createCharge(
    @Body() dto: CreateChargeDto,
    @UserPayloadDecorator() userPayload: UserPayloadInterface,
  ) {
    return await this.paymentsService.createCharge(dto, userPayload);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('history')
  async getHistory(@UserPayloadDecorator() userPayload: UserPayloadInterface) {
    return await this.paymentsService.getHistory(userPayload);
  }
}
