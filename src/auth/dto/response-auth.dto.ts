import { ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../../common/enum/role.enum';

export class ResponseAuthDto {
  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token for authentication',
  })
  @Expose()
  accessToken?: string;

  @ApiPropertyOptional({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token to renew the access token',
  })
  @Expose()
  refreshToken?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Unique user ID',
  })
  @Expose()
  id?: number;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @Expose()
  name?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'User email address',
    format: 'email',
  })
  @Expose()
  email?: string;

  @Exclude()
  password?: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'User role in the system',
    enum: UserRole,
  })
  @Expose()
  role?: UserRole;

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates if the user has adult mode enabled',
  })
  @Expose()
  adultMode?: boolean;

  @Exclude()
  createdAt?: Date;

  @Exclude()
  updatedAt?: Date;
}