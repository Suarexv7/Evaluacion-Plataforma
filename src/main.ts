import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global para todas las rutas (ej: http://localhost:3000/api/v1/...)
  app.setGlobalPrefix('api/v1');

  // 2. Pipes de validación global (Senior config)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remueve propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades extra
      transform: true,            // Convierte tipos automáticamente (ej: string a number)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 3. Interceptor de respuesta global (Formato { success, statusCode, data })
  app.useGlobalInterceptors(new TransformInterceptor());

  // 4. Configuración de Swagger para documentación
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Vacantes API')
    .setDescription('Documentación de la API para gestión de vacantes y aplicaciones')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('vacancies')
    .addTag('applications')
    .addTag('technologies')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 5. Configuración de CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Servidor corriendo en: http://localhost:${port}/api/v1`);
  logger.log(`📖 Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();