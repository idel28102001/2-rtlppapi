import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from '../../users-center/enums/role.enum';

export class ChangeRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  role: Role;
}
