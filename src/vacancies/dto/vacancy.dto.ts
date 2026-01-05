import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { JobModality } from '../entities/vacancy.entity'; 

export class CreateVacancyDto {
  @ApiProperty({ example: 'Desarrollador Backend NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Buscamos desarrollador con experiencia en NestJS...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: ['NestJS', 'TypeScript', 'PostgreSQL'] })
  @IsArray()
  @IsString({ each: true }) 
  @IsNotEmpty()
  technologies: string[];

  @ApiProperty({ example: 'Junior' })
  @IsString()
  @IsNotEmpty()
  seniority: string;

  @ApiProperty({ example: ['Trabajo en equipo', 'Comunicación'] })
  @IsArray() 
  @IsString({ each: true })
  @IsNotEmpty()
  softSkills: string[];

  @ApiProperty({ example: 'Barranquilla' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ enum: JobModality, example: JobModality.REMOTE })
  @IsEnum(JobModality)
  @IsNotEmpty()
  modality: JobModality;

  @ApiProperty({ example: '$2.000.000 - $3.500.000' })
  @IsString()
  @IsNotEmpty()
  salaryRange: string;

  @ApiProperty({ example: 'Riwi Tech' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  maxApplicants: number;
}

export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {}