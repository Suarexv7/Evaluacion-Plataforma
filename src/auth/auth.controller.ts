import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto, ResponseAuthDto } from './dto';
import { Public } from '../common/decorator/public.decorator';
import { plainToInstance } from 'class-transformer';
import { RefreshJwtGuard } from '../common/guards/refresh.guards';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account with USER role by default',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: ResponseAuthDto,
  })
  @ApiConflictResponse({
    description: 'Email is already registered',
    schema: {
      example: {
        statusCode: 409,
        method: 'POST',
        path: '/api/auth/register',
        message: 'Email already exists in the database',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or missing required fields',
    schema: {
      example: {
        statusCode: 400,
        method: 'POST',
        path: '/api/auth/register',
        message: 'Invalid data or missing required fields',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        method: 'POST',
        path: '/api/auth/register',
        message: 'Internal server error',
      },
    },
  })
  @Public()
  @Post('/register')
  async register(@Body() body: RegisterAuthDto) {
    const user = await this.authService.register(body);
    return {
      message: 'User created successfully',
      data: plainToInstance(ResponseAuthDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @ApiOperation({
    summary: 'Login',
    description:
      'Authenticates a user and returns JWT access and refresh tokens',
  })
  @ApiBody({ type: LoginAuthDto })
  @ApiCreatedResponse({
    description: 'Login successful, tokens generated',
    type: ResponseAuthDto,
  })
  @ApiBadRequestResponse({
    description: 'Missing required fields or invalid format',
    schema: {
      example: {
        statusCode: 400,
        method: 'POST',
        path: '/api/auth/login',
        message: 'Invalid data or missing required fields',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials (incorrect email or password)',
    schema: {
      example: {
        statusCode: 401,
        method: 'POST',
        path: '/api/auth/login',
        message: 'Invalid credentials',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found with the provided email',
    schema: {
      example: {
        statusCode: 404,
        method: 'POST',
        path: '/api/auth/login',
        message: 'User does not exist in the database',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        method: 'POST',
        path: '/api/auth/login',
        message: 'Internal server error',
      },
    },
  })
  @Public()
  @Post('/login')
  async login(@Body() body: LoginAuthDto) {
    const user = await this.authService.login(body);
    return {
      message: 'Successful login',
      data: plainToInstance(ResponseAuthDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @ApiOperation({
    summary: 'Refresh JWT tokens',
    description:
      'Generates new access and refresh tokens using the refresh token',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Tokens refreshed successfully',
    type: ResponseAuthDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    schema: {
      example: {
        statusCode: 401,
        method: 'POST',
        path: '/api/auth/refresh',
        message: 'Invalid or expired token',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        method: 'POST',
        path: '/api/auth/refresh',
        message: 'Internal server error',
      },
    },
  })
  @UseGuards(RefreshJwtGuard)
  @Post('/refresh')
  async refresh(@Headers('authorization') auth: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }
    const token = auth.substring(7);

    const tokens = await this.authService.refreshTokens(token);
    return {
      message: 'Tokens refreshed successfully',
      data: plainToInstance(ResponseAuthDto, tokens, {
        excludeExtraneousValues: true,
      }),
    };
  }
}