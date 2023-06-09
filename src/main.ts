import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
