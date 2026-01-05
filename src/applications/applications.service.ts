import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    
    private readonly vacanciesService: VacanciesService,
  ) {}

  async create(userId: number, vacancyId: number): Promise<Application> {
    // 1. Verificar si la vacante existe
    const vacancy = await this.vacanciesService.findOne(vacancyId);
    
    // 2. Verificar si está activa
    if (!vacancy.isActive) {
      throw new BadRequestException('La vacante no está activa');
    }

    // 3. Verificar cupos disponibles
    const spots = await this.vacanciesService.getAvailableSpots(vacancyId);
    if (spots <= 0) {
      throw new BadRequestException('No hay cupos disponibles para esta vacante');
    }

    // 4. Verificar duplicados
    const existingApplication = await this.applicationRepository.findOne({
      where: { 
        userId: userId, 
        vacancyId: vacancyId as any
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Ya te has postulado a esta vacante anteriormente');
    }

    // 5. Crear la postulación
    const newApplication = this.applicationRepository.create({
      userId,
      vacancyId: vacancyId as any,
    });

    return await this.applicationRepository.save(newApplication);
  }

  async findAll(vacancyId?: number): Promise<Application[]> {
    const query = this.applicationRepository.createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.vacancy', 'vacancy');

    if (vacancyId) {
      query.where('application.vacancyId = :vacancyId', { vacancyId });
    }

    return await query.getMany();
  }

  async findByUser(userId: number): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { userId },
      relations: ['vacancy'],
    });
  }

  async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id: id as any },
      relations: ['user', 'vacancy'],
    });

    if (!application) {
      throw new NotFoundException(`Postulación con ID ${id} no encontrada`);
    }

    return application;
  }
}