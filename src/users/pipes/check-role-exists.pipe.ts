import { Injectable, PipeTransform } from '@nestjs/common';
import { UsersValidateService } from '../services/users-validate.service';
import { ChangeRoleDto } from '../dtos/change-role.dto';

@Injectable()
export class CheckRoleExistsPipe implements PipeTransform {
  constructor(private readonly usersValidate: UsersValidateService) {}

  async transform(dto: ChangeRoleDto) {
    await this.usersValidate.checkRole(dto.role);
    return dto;
  }
}
