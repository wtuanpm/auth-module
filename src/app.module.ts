import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { GatewayModule } from './gateways/gateway.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AppConfigModule, GatewayModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
