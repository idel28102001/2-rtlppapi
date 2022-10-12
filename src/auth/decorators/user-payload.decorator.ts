import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayloadInterface } from '../interfaces/user-payload.interface';

export const UserPayloadDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayloadInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
