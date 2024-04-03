import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUserCredential = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException();

    return user;
  },
);
