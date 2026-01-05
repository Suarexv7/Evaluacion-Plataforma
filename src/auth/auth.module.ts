import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthStrategy } from './strategies/jwt-auth.strategy';
import { RefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_SECRET as string,
      signOptions: {
        expiresIn: Number(process.env.EXPIRES_TOKEN) | 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy, RefreshStrategy],
})
export class AuthModule {}