import * as Joi from 'joi';

const isProd = process.env.NODE_ENV === 'production';

export const envValidationSchema = Joi.object({
  // App
  APP_CONTAINER_NAME: Joi.string().optional(),
  APP_PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PRODUCTION_URL: Joi.string().optional(),
  FRONTEND_URL: Joi.string().optional(),

  // Postgres
  DB_CONTAINER_NAME: Joi.string().optional(),
  DATABASE_URL: isProd ? Joi.string().required() : Joi.string().optional(),
  POSTGRES_HOST: isProd ? Joi.string().optional() : Joi.string().required(),
  POSTGRES_PORT: isProd ? Joi.number().optional() : Joi.number().required(),
  POSTGRES_USER: isProd ? Joi.string().optional() : Joi.string().required(),
  POSTGRES_PASSWORD: isProd ? Joi.string().optional() : Joi.string().required(),
  POSTGRES_DB: isProd ? Joi.string().optional() : Joi.string().required(),

  // Swagger
  SWAGGER_TITLE: Joi.string().optional(),
  SWAGGER_DESCRIPTION: Joi.string().optional().default('Sin description'),
  SWAGGER_VERSION: Joi.number().optional(),

  // JWT
  JWT_PRIVATE_SECRET: Joi.string().required(),
  EXPIRES_TOKEN: Joi.string().default('4h'),
  JWT_REFRESH_PRIVATE_SECRET: Joi.string().required(),
  EXPIRES_REFRESH_TOKEN: Joi.string().default('20h'),
});