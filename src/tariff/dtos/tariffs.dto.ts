import { SubTariffDto } from './sub-tariff.dto';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TariffsDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  oneTime: boolean;

  @IsNotEmpty()
  @ApiProperty()
  @IsObject({ each: true })
  @Type(() => SubTariffDto)
  @ValidateNested()
  tariffs: SubTariffDto[];

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsInt()
  accessLevel: number;
}
