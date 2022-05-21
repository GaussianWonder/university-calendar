import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ForbiddenErrorFilter } from './auth/forbidden-error.filter';

export function inDevelopment(callback: CallableFunction) {
  process.env.NODE_ENV === 'development' && callback();
}

export function inProduction(callback: CallableFunction) {
  process.env.NODE_ENV === 'production' && callback();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet setup
  app.use(helmet());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('University Calendar')
    .setDescription('The UniversityCalendar API description')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  inDevelopment(() => {
    app.enableCors();
  });

  app.useGlobalFilters(new ForbiddenErrorFilter());

  await app.listen(3000);
}

bootstrap();
