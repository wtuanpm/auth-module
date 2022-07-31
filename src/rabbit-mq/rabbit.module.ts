import { Global, Module } from '@nestjs/common';
import { RABBIT_MQ } from 'src/common/providers/key.provider';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import * as amqplib from 'amqplib';
import { RabbitKeys } from 'src/common/constants/keys/rabbit.key';
import { RabbitPublishers } from './publishers/rabbit.publisher';
@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: RABBIT_MQ,
      useFactory: async (appconfigService: AppConfigService) => {
        const connection = await amqplib.connect(appconfigService.rmqUrl);
        const channel = await connection.createConfirmChannel();
        await channel.assertExchange(RabbitKeys.RMQ_EXCHANGE, 'direct', {
          durable: false,
        });
        await channel.assertQueue(RabbitKeys.RMQ_TRAVEL_AUTH_QUEUE);
        return channel;
      },
      inject: [AppConfigService],
    },
    RabbitPublishers,
  ],
  exports: [RABBIT_MQ],
})
export class RabbitMqModule {}
