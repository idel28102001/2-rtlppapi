import { Injectable, PipeTransform } from '@nestjs/common';
import { UsersValidateService } from '../services/users-validate.service';

@Injectable()
export class UserExistsByIdPipe implements PipeTransform {
  constructor(private readonly usersValidate: UsersValidateService) {}

  async transform(id: number) {
    await this.usersValidate.checkUserExistsById(id);
    return id;
  }
}
