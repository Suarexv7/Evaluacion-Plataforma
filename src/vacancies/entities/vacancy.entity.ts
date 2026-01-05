import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  UpdateDateColumn
} from 'typeorm';
import { Technology } from '../../technologies/entities/technology.entity';
import { Application } from '../../applications/entities/application.entity';

export enum JobModality {
  REMOTE = 'remote',
  OFFICE = 'office',
  HYBRID = 'hybrid',
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  seniority: string;

  @Column({ name: 'soft_skills', type: 'simple-array', nullable: true })
  softSkills: string[];

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: JobModality,
    default: JobModality.REMOTE,
  })
  modality: JobModality;

  @Column({ name: 'salary_range' })
  salaryRange: string;

  @Column()
  company: string;

  @Column({ name: 'max_applicants', type: 'int', default: 10 })
  maxApplicants: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // --- RELACIONES ---

  @ManyToMany(() => Technology, (technology) => technology.vacancies, {
    cascade: true,
  })
  @JoinTable({
    name: 'vacancy_technologies',
    joinColumn: { name: 'vacancy_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies: Technology[];

  @OneToMany(() => Application, (application) => application.vacancy)
  applications: Application[];
}