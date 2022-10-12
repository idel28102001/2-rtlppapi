import { Injectable, PipeTransform } from '@nestjs/common';
import { UsersValidateService } from '../services/users-validate.service';
import { UsersRegisterDto } from '../dtos/users-register.dto';

@Injectable()
export class UserExistsPipe implements PipeTransform {
  constructor(private readonly usersValidate: UsersValidateService) {}

  async transform(dto: UsersRegisterDto) {
    await this.usersValidate.checkUserExistsByEmail(dto.email);
    return dto;
  }
}
