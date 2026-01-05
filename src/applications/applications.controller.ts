import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Query,
  ParseIntPipe, // Importamos el Pipe para transformar datos
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { AuthJwtGuard } from '../common/guards/auth.guards';
import { AuthRoleGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorator/roles.decorator';
import { GetUser } from '../common/decorator/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enum/role.enum'; 

@ApiTags('Applications')
@ApiSecurity('api-key')
@ApiBearerAuth('JWT-auth')
@Controller('applications')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('apply/:vacancyId')
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Postularse a una vacante (Coder)' })
  create(
    @Param('vacancyId', ParseIntPipe) vacancyId: number, 
    @GetUser() user: User
  ) {
    return this.applicationsService.create(user.id, vacancyId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Listar todas las postulaciones (Admin/Gestor)' })
  findAll(@Query('vacancyId') vacancyId?: string) {
    const vacancyIdNum = vacancyId ? Number(vacancyId) : undefined;
    return this.applicationsService.findAll(vacancyIdNum);
  }

  @Get('my-applications')
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Mis postulaciones (Coder)' })
  findMyApplications(@GetUser() user: User) {
    return this.applicationsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una postulación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.findOne(id);
  }
}