import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { User, UserSchema } from './modules/auth/schemas/user.schema';
import { InstitutionModule } from './modules/institution/institution.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { CategoryModule } from './modules/category/category.module';
import { GeminiModule } from './modules/gemini/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error('MONGO_URI environment variable is not defined');
        }
        return {
          uri,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),

    AuthModule,
    UsersModule,
    InstitutionModule,
    TicketsModule,
    CategoryModule,
    GeminiModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
      useValue: {
        exclude: ['/api/v1/gemini'],
      },
    },
  ],
})
export class AppModule {}
