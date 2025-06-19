import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module( {
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
      load: [ configuration ],
    } ),
    TypeOrmModule.forRootAsync( {
      imports: [ ConfigModule ],
      useFactory: async ( configService: ConfigService ) => ( {
        type: 'postgres',
        url: configService.get<string>( 'app.databaseUrl' ),
        entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
        synchronize: true,
      } ),
      inject: [ ConfigService ],
    } ),
    AuthModule,
    TasksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
} )
export class AppModule { }