import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/vacancy.dto';
import { AuthJwtGuard } from '../common/guards/auth.guards';
import { AuthRoleGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorator/roles.decorator';
import { UserRole } from '../common/enum/role.enum';

@ApiTags('vacancies')
@ApiSecurity('api-key') 
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Solo Admin o Gestor crean vacantes
  @UseGuards(AuthJwtGuard, AuthRoleGuard)
  @ApiOperation({ summary: 'Crear una nueva vacante' })
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las vacantes activas' })
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una vacante' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.findOne(id);
  }

  @Get(':id/spots')
  @ApiOperation({ summary: 'Ver cupos disponibles en una vacante' })
  getSpots(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.getAvailableSpots(id);
  }
}