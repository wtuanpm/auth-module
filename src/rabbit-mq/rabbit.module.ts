import { Global, Module } from '@nestjs/common';
import { RABBIT_MQ, REDIS } from 'src/common/providers/key.provider';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import * as amqplib from 'amqplib';
import { RabbitKeys } from 'src/common/constants/keys/rabbit.key';
import { RabbitPublishers } from './publishers/rabbit.publisher';
import { RabbitSubscribers } from './subscribers/rabbit.subscriber';
import { BlackListService } from 'src/black-list/services/implements/black-list.service';
import { UserTokenService } from 'src/user-token/services/implements/user-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokens } from 'src/database/entities/user-token.entity';
import { BlackList } from 'src/database/entities/blacklist.entity';
import { SocketGateway } from 'src/gateways/gateway';
import { GatewayModule } from 'src/gateways/gateway.module';
@Global()
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forFeature([UserTokens, BlackList]),
    GatewayModule,
  ],
  providers: [
    {
      provide: RABBIT_MQ,
      useFactory: async (appconfigService: AppConfigService) => {
        const connection = await amqplib.connect(appconfigService.rmqUrl);
        const channel = await connection.createConfirmChannel();
        await channel.assertExchange(RabbitKeys.RMQ_EXCHANGE, 'direct', {
          durable: false,
        });
        await channel.assertQueue(RabbitKeys.RMQ_WS_TRAVEL_AUTH_QUEUE);
        return channel;
      },
      inject: [AppConfigService],
    },
    RabbitPublishers,
    RabbitSubscribers,
    BlackListService,
    UserTokenService,
  ],
  exports: [RABBIT_MQ],
})
export class RabbitMqModule {}
