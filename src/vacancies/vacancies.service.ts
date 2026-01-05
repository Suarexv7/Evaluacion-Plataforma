import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/vacancy.dto';
import { TechnologiesService } from '../technologies/technologies.service';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
    private readonly technologiesService: TechnologiesService,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
    if (createVacancyDto.maxApplicants < 1) {
      throw new BadRequestException('maxApplicants must be at least 1');
    }

    const technologies = await this.technologiesService.findOrCreateMultiple(
      createVacancyDto.technologies,
    );

    const { technologies: _, ...vacancyData } = createVacancyDto;

    const newVacancy = this.vacancyRepo.create({
      ...vacancyData,
      technologies,
    });

    return await this.vacancyRepo.save(newVacancy);
  }


  async findAll(): Promise<Vacancy[]> {
    return await this.vacancyRepo.find({
      where: { isActive: true }, // Solo mostramos vacantes activas
      relations: ['technologies'],
    });
  }

  async findOne(id: number): Promise<Vacancy> {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id },
      relations: ['technologies', 'applications'],
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${id} not found`);
    }

    return vacancy;
  }

  async getAvailableSpots(id: number): Promise<number> {
    const vacancy = await this.findOne(id);
    const count = vacancy.applications ? vacancy.applications.length : 0;
    return vacancy.maxApplicants - count;
  }
}