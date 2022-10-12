import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChargeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  amount: string;

  @ApiProperty()
  @IsString()
  currency: string;
}
