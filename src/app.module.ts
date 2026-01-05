import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { SeedModule } from './common/seeders/seed.module';

@Module({
  imports: [
    // 1. Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Forzamos la lectura del archivo en la raíz
    }),

    // 2. Conexión a Base de Datos robusta
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Extraemos variables según tu esquema de DataSource
        const host = configService.get<string>('POSTGRES_HOST');
        const port = configService.get<number>('POSTGRES_PORT');
        const username = configService.get<string>('POSTGRES_USER'); // Importante: USER, no USERNAME
        const password = configService.get<string>('POSTGRES_PASSWORD');
        const database = configService.get<string>('POSTGRES_DB');   // Importante: DB, no DATABASE

        // LOGS DE DIAGNÓSTICO (Para ver qué está fallando)
        console.log('======= DIAGNÓSTICO DE CONEXIÓN =======');
        console.log(`Host: ${host}`);
        console.log(`Usuario: ${username}`);
        console.log(`Base de Datos: ${database}`);
        console.log(`Password cargada: ${password ? 'SÍ (Texto detectado)' : 'NO (ESTÁ VACÍA)'}`);
        console.log('=======================================');

        return {
          type: 'postgres',
          host,
          port: Number(port) || 5432,
          username,
          password: String(password ?? ''), // Evita el error SASL forzando string
          database,
          autoLoadEntities: true,
          synchronize: true, // true para desarrollo, false para producción
          logging: true,
        };
      },
    }),

    // 3. Módulos de la Aplicación
    AuthModule,
    UsersModule,
    VacanciesModule,
    ApplicationsModule,
    TechnologiesModule,
    SeedModule,
  ],
})
export class AppModule {}