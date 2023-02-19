import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { CustomLogger } from './domain/helpers';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter, TypeOrmExceptionFilter } from './application/exception.handlers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Global Error
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new HttpExceptionFilter( logger));
  app.useGlobalFilters(new TypeOrmExceptionFilter(logger));

  // to secure app from some well-known web vulnerabilities via HTTP headers.
  app.use(helmet());
  // Swagger will be disabled on production
  if (process.env.NEST_ENV != 'production') {
    const config = new DocumentBuilder()
      .setTitle('Test App')
      .setDescription('The Test API description')
      .setVersion('1.0')
      .addTag('Test')
      .addBearerAuth(
        {
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          description: 'add user token to be authenticated',
          bearerFormat: 'JWT',
        },
        'JWT-auth',
      )
      .setExternalDoc('swagger document', `http://[::1]:3000/api-json.json`)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    // TODO: Implement Swagger Document Link
    // writeFileSync(
    //   path.join(__dirname, '..', 'public', 'api-json.json'),
    //   JSON.stringify(document),
    // );
    SwaggerModule.setup('swagger', app, document);
    app.enableCors({
      origin: '*',
      allowedHeaders: '*',
      methods: '*',
    });
  } else {
    app.enableCors({
      origin: process.env.ORIGINS,
      allowedHeaders: '*',
      methods: '*',
    });
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(+process.env.lISTEN_PORT | 3000);

  CustomLogger('NEST Environment Is:', `${process.env.NEST_ENV}`);
  console.info(`${await app.getUrl()}/swagger`);
}

bootstrap();
