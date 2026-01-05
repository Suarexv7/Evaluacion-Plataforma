import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacanciesService } from './vacancies.service'; 
import { VacanciesController } from './vacancies.controller';
import { Vacancy } from './entities/vacancy.entity';
import { TechnologiesModule } from '../technologies/technologies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacancy]), 
    TechnologiesModule // Importante para que el servicio pueda buscar tecnologías
  ],
  controllers: [VacanciesController],
  providers: [VacanciesService],
  exports: [VacanciesService],
})
export class VacanciesModule {}