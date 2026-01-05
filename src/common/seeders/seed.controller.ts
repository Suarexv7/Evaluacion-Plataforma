import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: 'Llenar base de datos con datos de prueba' })
  executeSeed() {
    return this.seedService.runSeed();
  }
}