import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap ()
{
  const app = await NestFactory.create( AppModule );

  // Global validation pipe strips unknown properties
  app.useGlobalPipes( new ValidationPipe( { whitelist: true } ) );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle( 'ZigTask API' )
    .setDescription( 'API documentation for the ZigTask application' )
    .setVersion( '1.0' )
    .addBearerAuth( {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    }, 'bearer' )
    .addSecurityRequirements( 'bearer' )
    .build();

  const document = SwaggerModule.createDocument( app, config );
  SwaggerModule.setup( 'api/docs', app, document );

  // Start the application
  const port = process.env.PORT || 3000;
  await app.listen( port );
  console.log( `Application is running on: http://localhost:${ port }` );
}
bootstrap();