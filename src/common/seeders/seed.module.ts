import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { Technology } from '../../technologies/entities/technology.entity';
import { SeedController } from './seed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Vacancy, Technology])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}