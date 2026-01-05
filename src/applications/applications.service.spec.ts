import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { BadRequestException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;
  let vacanciesService: VacanciesService;

  const mockVacancy = {
    id: 1, 
    title: 'Backend Developer',
    isActive: true,
    maxApplicants: 10,
  };

  const mockApplication = {
    id: 1,
    userId: 1, 
    vacancyId: 1,
    appliedAt: new Date(),
  };

  const mockVacanciesService = {
    findOne: jest.fn(),
    getAvailableSpots: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockApplication),
    save: jest.fn().mockResolvedValue(mockApplication),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { 
          provide: getRepositoryToken(Application), 
          useValue: mockRepository 
        },
        { 
          provide: VacanciesService, 
          useValue: mockVacanciesService 
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    repository = module.get<Repository<Application>>(getRepositoryToken(Application));
    vacanciesService = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una postulación exitosamente', async () => {

      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockVacanciesService.getAvailableSpots.mockResolvedValue(5);
      mockRepository.findOne.mockResolvedValue(null);


      const result = await service.create(1, 1);

      expect(result).toEqual(mockApplication);
      expect(mockVacanciesService.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar error si ya existe la postulación', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(mockApplication);


      await expect(service.create(1, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('debe retornar las postulaciones de un usuario', async () => {
      const mockApplications = [mockApplication];
      mockRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findByUser(1);

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['vacancy'],
      });
      expect(result).toEqual(mockApplications);
    });
  });
});