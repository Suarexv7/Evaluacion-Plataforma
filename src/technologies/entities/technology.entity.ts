import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

@Entity('technologies')
export class Technology {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // El nombre debe ser único para evitar "Java" y "java"
  name: string;

  @ManyToMany(() => Vacancy, (vacancy) => vacancy.technologies)
  vacancies: Vacancy[];
}