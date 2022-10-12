import { SubTariffDto } from './sub-tariff.dto';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TariffsEditDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  name: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  oneTime: boolean;

  @IsNotEmpty()
  @ApiProperty()
  @IsObject({ each: true })
  @Type(() => SubTariffDto)
  @ValidateNested()
  @IsOptional()
  tariffs: SubTariffDto[];

  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsInt()
  @IsOptional()
  accessLevel: number;
}
