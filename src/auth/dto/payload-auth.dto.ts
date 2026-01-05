import { IsEnum, IsNotEmpty, IsNumber, IsEmail, IsString } from 'class-validator';
import { UserRole } from '../../common/enum/role.enum';

export class PayloadAuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  sub: number; // El ID del usuario (sujeto del token)

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}