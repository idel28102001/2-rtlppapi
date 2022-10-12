import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Role } from '../../users-center/enums/role.enum';

export const RegisterResponse = <TModel>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              username: { type: 'string', example: 'ivan' },
              email: { type: 'string', example: 'ivan@mail.ru' },
              onewas: { type: 'boolean', example: false },
              id: { type: 'integer', example: 1 },
              createdAt: { type: 'string', example: new Date() },
              updatedAt: { type: 'string', example: new Date() },
              role: {
                type: 'string',
                enum: [Role.USER, Role.ADMIN],
                example: Role.USER,
              },
            },
          },
        ],
      },
      description: 'Регистрирует пользователя на ресурсе',
    }),
  );
};
