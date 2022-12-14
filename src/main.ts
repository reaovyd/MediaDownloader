import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT =
    process.env.NODE_ENV === 'dev'
      ? process.env.DEV_PORT
      : process.env.PROD_PORT;
  await app.listen(PORT);
}
bootstrap();
