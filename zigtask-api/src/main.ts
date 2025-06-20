import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap ()
{
  const app = await NestFactory.create( AppModule );

  // Enable CORS
  app.enableCors( {
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  } );

  // Add request logging middleware
  app.use( ( req: any, res: any, next: () => void ) =>
  {
    const start = Date.now();
    const { method, originalUrl, body = {}, query = {}, params = {} } = req;

    res.on( 'finish', () => 
    {
      const duration = Date.now() - start;
      console.log( `[${ new Date().toISOString() }] ${ method } ${ originalUrl }` );

      // Safely log body if it exists
      if ( body && typeof body === 'object' && Object.keys( body ).length > 0 )
      {
        console.log( 'Body:', JSON.stringify( body, null, 2 ) );
      }

      // Safely log query params if they exist
      if ( query && typeof query === 'object' && Object.keys( query ).length > 0 )
      {
        console.log( 'Query:', JSON.stringify( query, null, 2 ) );
      }

      // Safely log route params if they exist
      if ( params && typeof params === 'object' && Object.keys( params ).length > 0 )
      {
        console.log( 'Params:', JSON.stringify( params, null, 2 ) );
      }

      console.log( `Status: ${ res.statusCode } - ${ duration }ms` );
      console.log( '---' );
    } );

    next();
  } );

  // Enable CORS
  app.enableCors( {
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  } );

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