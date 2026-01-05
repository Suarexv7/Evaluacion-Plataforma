import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { User } from '../users/entities/user.entity'; 
import {
  LoginAuthDto,
  RegisterAuthDto,
  PayloadAuthDto,
  ResponseAuthDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { PayloadRefreshAuthDto } from './dto/payload-refresh-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(body: RegisterAuthDto): Promise<ResponseAuthDto> {
    const { password, email, name } = body;


    const existingUser = await this.usersRepo.findOneBy({ email });
    if (existingUser) {
      this.logger.warn(`Attempted registration with existing email: ${email}`);
      throw new ConflictException(
        `User with email '${email}' already exists.`,
      );
    }

    let hashedPassword: string;
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (err) {
      this.logger.error('Password hashing failed', err);
      throw new InternalServerErrorException('Failed to process password');
    }


    const newUserEntity = this.usersRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepo.save(newUserEntity);
    return savedUser as any;
  }

  async login(body: LoginAuthDto): Promise<ResponseAuthDto> {
    const { email, password } = body;

    const user = await this.usersRepo.findOneBy({ email });
    if (!user) {
      this.logger.warn(`Login failed – email not found: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    let passwordValid: boolean;
    try {
      passwordValid = await bcrypt.compare(password, user.password);
    } catch (err) {
      this.logger.error('Password comparison failed', err);
      throw new InternalServerErrorException('Failed to verify credentials');
    }

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: PayloadAuthDto = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any, 
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      ...user,
    } as any;
  }

  async refreshTokens(token: string): Promise<ResponseAuthDto> {
    let payload: PayloadRefreshAuthDto;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_PRIVATE_SECRET,
        ignoreExpiration: true,
      });
    } catch (err) {
      this.logger.error('Invalid token', err);
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersRepo.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { exp, iat, ...rest } = payload;


    const newAccessToken = await this.jwtService.signAsync(rest, {
      secret: process.env.JWT_PRIVATE_SECRET,

      expiresIn: (process.env.EXPIRES_TOKEN as any) || '15m',
    });

    return {
      accessToken: newAccessToken,
    };
  }
}