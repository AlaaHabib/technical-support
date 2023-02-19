import { AppService } from './app.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions, DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDatabase, SeederOptions, dropDatabase } from 'typeorm-extension';
import { entities } from './domain/entities';
import { CustomLogger } from './domain/helpers';
import { SeedRunner } from './infrastructure/database/seed-runner.seed';
import { AuthModule } from './api/auth/auth.module';
import { RequestContextMiddleware } from './domain/middlewares/request-context.middleware';
import { WinstonModule } from 'nest-winston';
import { UserModule } from './api/user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataSourceBasicOptions: DataSourceOptions & SeederOptions = {
          type: 'mysql',
          host: configService.get('DATA_BASE_HOST'),
          port: +configService.get('DATA_BASE_PORT'),
          username: configService.get('DATA_BASE_USER_NAME'),
          password: configService.get('DATA_BASE_PASSWORD'),
          database: configService.get('DATA_BASE_NAME'),
          entities,
          logging: configService.get('NEST_ENV') != 'production' ? true : false,
          // factories: ['./infrastructure/database/factories/*.factory.ts'],
          // seeds: [UserSeeder],
        };
        // CustomLogger('start database drop');
        // await dropDatabase({
        //   options: dataSourceBasicOptions,
        //   ifExist: true,
        //   initialDatabase: 'mysql',
        // });
        // CustomLogger('end database drop');

        CustomLogger('start database creation');

        await createDatabase({
          ifNotExist: true,
          options: dataSourceBasicOptions,
          synchronize: true,
          initialDatabase: 'mysql',
        });
        CustomLogger('end database creation');
        await SeedRunner.run(
          new DataSource(dataSourceBasicOptions),
          configService,
        );
        return {
          ...dataSourceBasicOptions,
          synchronize: true,

          // migrations: ['src/migration/*{.ts,.js}'],
          // migrationsTableName: 'db_migration_table',
        };
      },
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const fileLogErrors = new winston.transports.File({
          level: 'error',
          filename:
            configService.get('File_Log_Errors_File_Name') || 'app.error.log',
          dirname: configService.get('File_Log_Path') || './log',
        });
        const fileLogInfo = new winston.transports.File({
          level: 'verbose',
          filename: configService.get('File_Log_Info_File_Name') || 'app.log',
          dirname: configService.get('File_Log_Path') || './log',
        });
        const consoleLog = new winston.transports.Console({
          format: winston.format.simple(),
        });
        const transports: any[] = [fileLogErrors, fileLogInfo];
        if (configService.get('NEST_ENV') != 'production')
          transports.push(consoleLog);
        return {
          levels: winston.config.cli.levels,
          exitOnError: false,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json({ space: 2 }),
          ),
          transports,
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
