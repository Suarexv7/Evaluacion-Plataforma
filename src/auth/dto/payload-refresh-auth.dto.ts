import { PickType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from './register-auth.dto';
import { UserRole } from '../../common/enum/role.enum';

export class PayloadRefreshAuthDto extends PickType(RegisterAuthDto, [
  'name',
  'email',
]) {
  sub: number;
  role: UserRole;
  iat: number;
  exp: number;
}