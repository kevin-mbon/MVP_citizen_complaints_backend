import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, UserStatus } from '../../../common/enums/user-role';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug(`User from request: ${JSON.stringify(user)}`);

    // Ensure user exists
    if (!user) {
      this.logger.error('No user found in request');
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if the user is active
    if (user.status === UserStatus.INACTIVE) {
      this.logger.error(`User ${user.email} is inactive`);
      throw new UnauthorizedException('User account is inactive');
    }

    // Check if a user has a required role
    const hasRequiredRole = requiredRoles.some(role => user.role === role);
    this.logger.debug(`User role: ${user.role}, Has required role: ${hasRequiredRole}`);

    return hasRequiredRole;
  }
}