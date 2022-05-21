import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AbilityModule } from './auth/ability/ability.module';
import { AuthModule } from './auth/auth.module';
import { ClassTransformOmitInterceptor } from './common/interceptors/class-transform-omit.interceptor';
import { UserModule } from './models/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
  ],
  controllers: [AppController],
  providers: [AppService, ClassTransformOmitInterceptor.Provider],
  exports: [ConfigModule],
})
export class AppModule {}
