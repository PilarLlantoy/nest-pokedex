import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //validacion con pipes de manera global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //solo deja la data esperada en la clase definida
      forbidNonWhitelisted: true, //manda mensaje cuando no debe mandar propiedades incorrectas
    })
  );
  
  app.setGlobalPrefix('api/v2'); //agregamos el prefijo 'api/v2' a las rutas de los servicios: http://localhost:3000/api/v2/pokemon
  await app.listen(3000);
}
bootstrap();
