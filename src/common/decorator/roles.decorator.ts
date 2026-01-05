import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../constant/key-roles.decorator';
import { UserRole } from '../enum/role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);