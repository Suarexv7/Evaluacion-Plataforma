import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // Registramos la entidad User para que el repositorio esté disponible
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    // Exportamos el UsersService por si AuthService lo necesita directamente
    UsersService, 
    // Exportamos el TypeOrmModule para que el repositorio de User 
    // sea visible en otros módulos que importen este UsersModule
    TypeOrmModule 
  ],
})
export class UsersModule {}