/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Task API')
    .setDescription(
      'A task management API with auth, roles, soft deletes, and more',
    )
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT token input in Swagger UI
    .build();
  
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unallowed properties
      forbidNonWhitelisted: true, // throws if extra fields exist
      transform: true, // transforms payload to DTO classes
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
