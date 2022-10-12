import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersCenterService } from '../../users-center/services/users-center.service';
import { AuthLoginDto } from '../dtos/auth-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersCenterService: UsersCenterService,
    private readonly jwtService: JwtService,
  ) {}
  async login(dto: AuthLoginDto) {
    const {
      id: userId,
      email,
      role,
      username,
    } = await this.usersCenterService.findByOpts({
      where: { email: dto.email },
      select: ['id', 'email', 'role', 'username'],
    });
    const some = { userId, email, role };
    return { role, username, access_token: this.jwtService.sign(some) };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersCenterService.findByOpts({
      where: { email },
      select: ['password'],
    });
    const check = user ? bcrypt.compareSync(password, user?.password) : null;
    if (!(user && check))
      throw new UnauthorizedException('Неверный email или пароль');
    else return true;
  }
}
