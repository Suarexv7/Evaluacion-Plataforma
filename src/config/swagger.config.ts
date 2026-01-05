import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';

const URL = process.env.PRODUCTION_URL!;

export const buildSwaggerConfig = (config: ConfigService) => {
  const isProd = config.get<string>('NODE_ENV') === 'production';

  const builder = new DocumentBuilder()
    .setTitle(config.get<string>('SWAGGER_TITLE') ?? 'API')
    .setDescription(config.get<string>('SWAGGER_DESCRIPTION')!)
    .setVersion(config.get<string>('SWAGGER_VERSION') ?? '1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addTag('Auth')
    .addTag('Users')
    .addTag('Progress')
    .addTag('General Simulators')
    .addTag('Neqli Simulator')
    .addTag('Tura Simulator');
  if (!isProd) {
    builder.addServer('http://localhost:3000', 'Local');
  }

  if (isProd) {
    builder.addServer(config.get<string>('PRODUCTION_URL')!, 'Production');
  }
  return builder.build();
};