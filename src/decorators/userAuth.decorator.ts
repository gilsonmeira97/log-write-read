import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Decorator created to extract the user injected by Guard in the request after validating the jwt token.
export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['user'];
  },
);