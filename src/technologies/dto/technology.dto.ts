import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTechnologyDto {
  @ApiProperty({ example: 'Node.js', description: 'Nombre de la tecnología' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}