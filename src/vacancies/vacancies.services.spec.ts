import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacanciesService } from './vacancies.service';
import { Vacancy, JobModality } from './entities/vacancy.entity';
import { TechnologiesService } from '../technologies/technologies.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let repository: Repository<Vacancy>;
  let technologiesService: TechnologiesService;


  const mockVacancy: Partial<Vacancy> = {
    id: 1, 
    title: 'Backend Developer',
    description: 'Desarrollador backend con NestJS',
    seniority: 'Junior',
    location: 'Barranquilla',
    modality: JobModality.REMOTE,
    salaryRange: '$2.000.000 - $3.000.000',
    company: 'Riwi Tech',
    maxApplicants: 10,
    isActive: true,
    softSkills: ['Trabajo en equipo'], 
    applications: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  const mockTechnologiesService = {
    findOrCreateMultiple: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockRepository,
        },
        {
          provide: TechnologiesService,
          useValue: mockTechnologiesService,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    repository = module.get<Repository<Vacancy>>(getRepositoryToken(Vacancy));
    technologiesService = module.get<TechnologiesService>(TechnologiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una vacante exitosamente', async () => {
      const createVacancyDto = {
        title: 'Backend Developer',
        description: 'Desarrollador backend con NestJS',
        technologies: ['NestJS', 'TypeScript'],
        seniority: 'Junior',
        softSkills: ['Trabajo en equipo'],
        location: 'Barranquilla',
        modality: JobModality.REMOTE,
        salaryRange: '$2.000.000 - $3.000.000',
        company: 'Riwi Tech',
        maxApplicants: 10,
      };

      const mockTechnologies = [
        { id: 1, name: 'NestJS' },
        { id: 2, name: 'TypeScript' },
      ];

      mockTechnologiesService.findOrCreateMultiple.mockResolvedValue(mockTechnologies);
      mockRepository.create.mockReturnValue(mockVacancy);
      mockRepository.save.mockResolvedValue(mockVacancy);

      const result = await service.create(createVacancyDto as any);

      expect(technologiesService.findOrCreateMultiple).toHaveBeenCalledWith(
        createVacancyDto.technologies,
      );
      expect(result).toEqual(mockVacancy);
    });

    it('debe lanzar BadRequestException si maxApplicants es menor a 1', async () => {
      const createVacancyDto = {
        title: 'Backend Developer',
        description: 'Desarrollador backend',
        technologies: ['NestJS'],
        seniority: 'Junior',
        softSkills: ['Trabajo en equipo'],
        location: 'Barranquilla',
        modality: JobModality.REMOTE, 
        salaryRange: '$2.000.000 - $3.000.000',
        company: 'Riwi Tech',
        maxApplicants: 0,
      };

      await expect(service.create(createVacancyDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('debe retornar una vacante por ID', async () => {
      mockRepository.findOne.mockResolvedValue(mockVacancy);

      const result = await service.findOne(1); 

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['technologies', 'applications'],
      });
      expect(result).toEqual(mockVacancy);
    });
  });
});