import { PickType } from '@nestjs/swagger';
import { RegisterAuthDto } from './register-auth.dto';

/**
 * DTO for user authentication
 * Inherits email and password from RegisterAuthDto with its Swagger documentation
 */
export class LoginAuthDto extends PickType(RegisterAuthDto, [
  'email',
  'password',
] as const) {}