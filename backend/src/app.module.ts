import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AbilityModule } from './auth/ability/ability.module';
import { AuthModule } from './auth/auth.module';
import { ClassTransformOmitInterceptor } from './common/interceptors/class-transform-omit.interceptor';
import { UserModule } from './models/user/user.module';
import { CourseModule } from './models/course/course.module';
import { FacultyModule } from './models/faculty/faculty.module';
import { UniversityModule } from './models/university/university.module';
import { TaskModule } from './models/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    AbilityModule,
    CourseModule,
    FacultyModule,
    UniversityModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, ClassTransformOmitInterceptor.Provider],
  exports: [ConfigModule],
})
export class AppModule {}
