import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../constant/key-roles.decorator';
import type { RequestUser } from '../types/request-user.type';

export class AuthRoleGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const req = context.switchToHttp().getRequest<RequestUser>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        'You do not have permission for this action.',
      );
    }

    return true;
  }
}