import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubTariffDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;
}
