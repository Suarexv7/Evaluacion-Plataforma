import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vacancy, JobModality } from '../../vacancies/entities/vacancy.entity';
import { Technology } from '../../technologies/entities/technology.entity';
import { UserRole } from '../enum/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Vacancy) private readonly vacancyRepo: Repository<Vacancy>,
    @InjectRepository(Technology) private readonly techRepo: Repository<Technology>,
  ) {}

  async runSeed() {
    // 1. Limpiar base de datos (Opcional, cuidado en prod)
    await this.vacancyRepo.delete({});
    await this.techRepo.delete({});
    await this.userRepo.delete({});

    // 2. Crear Tecnologías
    const techs = await this.techRepo.save([
      { name: 'NestJS' }, { name: 'TypeScript' }, { name: 'PostgreSQL' }
    ]);

    // 3. Crear Usuarios (Admin y Coder)
    const password = await bcrypt.hash('Admin123!', 10);
    const admin = await this.userRepo.save({
      name: 'Admin Global',
      email: 'admin@riwi.com',
      password,
      role: UserRole.ADMIN,
    });

    // 4. Crear Vacante de ejemplo
    await this.vacancyRepo.save({
      title: 'Senior NestJS Developer',
      description: 'Buscamos un experto en backend',
      company: 'Riwi Tech',
      location: 'Medellín',
      salaryRange: '$8.000.000 - $12.000.000',
      modality: JobModality.REMOTE,
      maxApplicants: 5,
      seniority: 'Senior',
      softSkills: ['Liderazgo', 'Comunicación'],
      isActive: true,
      technologies: [techs[0], techs[1]], // Relacionamos las tech creadas
    });

    return { message: 'Seed ejecutado con éxito' };
  }
}