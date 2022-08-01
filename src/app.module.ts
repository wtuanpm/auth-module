import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlackListModule } from './black-list/black-list.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { GatewayModule } from './gateways/gateway.module';
import { RabbitMqModule } from './rabbit-mq/rabbit.module';
import { RedisModule } from './redis/redis.module';
import { UserTokenModule } from './user-token/user-token.module';

@Module({
  imports: [
    AppConfigModule,
    GatewayModule,
    RabbitMqModule,
    RedisModule,
    BlackListModule,
    UserTokenModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
