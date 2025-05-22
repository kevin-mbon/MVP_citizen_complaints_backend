
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // For password reset, we only need userId
    if (data === 'userId' && request.userId) {
      return request.userId;
    }

    // For other cases, return the full user or specific property
    const user = request.user;
    return data ? user?.[data] : user;
  },
);