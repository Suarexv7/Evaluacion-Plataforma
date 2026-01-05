import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const isProd = config.get<string>('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      ...(isProd
        ? {
            url: config.get<string>('DATABASE_URL'),
            ssl: { rejectUnauthorized: false },
          }
        : {
            host: config.get<string>('POSTGRES_HOST'),
            port: config.get<number>('POSTGRES_PORT'),
            username: config.get<string>('POSTGRES_USER'),
            password: config.get<string>('POSTGRES_PASSWORD'),
            database: config.get<string>('POSTGRES_DB'),
          }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: false,
      logging: !isProd,
    };
  },
};