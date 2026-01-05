import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  UseInterceptors, 
  ClassSerializerInterceptor,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { UsersService } from './user.service'; 
import { CreateUserDto } from './dto/user.dto';


import { AuthJwtGuard } from '../common/guards/auth.guards';
import { AuthRoleGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/enum/role.enum';

@ApiTags('users')
@ApiSecurity('api-key')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo Coder' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN) 
  @UseGuards(AuthJwtGuard, AuthRoleGuard) 
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo Admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthJwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Obtener detalle de un usuario' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.usersService.findOne(id);
  }
}