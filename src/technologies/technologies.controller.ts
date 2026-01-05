import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto } from './dto/technology.dto';
import { AuthJwtGuard } from '../common/guards/auth.guards';
import { AuthRoleGuard } from '../common/guards/roles.guards'; 
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/enum/role.enum';

@ApiTags('technologies')
@ApiSecurity('api-key') 
@Controller('technologies')


export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.GESTOR) 
  @UseGuards(AuthJwtGuard, AuthRoleGuard)
  @ApiOperation({ summary: 'Crear una nueva tecnología' })
  @ApiHeader({ name: 'x-api-key', description: 'API Key de seguridad' })
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tecnologías' })
  findAll() {
    return this.technologiesService.findAll();
  }
}