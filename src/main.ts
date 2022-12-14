import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis({
  //   password: appConfigService.redisPass,
  //   url: appConfigService.redisUrl,
  // });

  // app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
