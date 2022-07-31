import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { Channel, ConsumeMessage } from 'amqplib';
import { channel } from 'diagnostics_channel';
import { RabbitKeys, RoutingKeys } from 'src/common/constants/keys/rabbit.key';
import { RABBIT_MQ } from 'src/common/providers/key.provider';

export class RegisterSubscriber implements OnApplicationBootstrap {
  constructor(@Inject(RABBIT_MQ) private readonly channel: Channel) {}
  bindRegisterQueue() {
    return this.channel.bindQueue(
      RabbitKeys.RMQ_TRAVEL_AUTH_QUEUE,
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.REGISTER_ROUTING_KEY,
    );
  }

  bindSignInQueue() {
    return this.channel.bindQueue(
      RabbitKeys.RMQ_TRAVEL_AUTH_QUEUE,
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.SIGNIN_ROUTING_KEY,
    );
  }

  bindSignInAcceptedQueue() {
    return this.channel.bindQueue(
      RabbitKeys.RMQ_TRAVEL_AUTH_QUEUE,
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.LS_SIGNIN_ACCEPTED_KEY,
    );
  }

  async consume() {
    await this.channel.consume(
      RabbitKeys.RMQ_TRAVEL_AUTH_QUEUE,
      async (msg: ConsumeMessage) => {
        switch (msg.fields.routingKey as RoutingKeys) {
          case RoutingKeys.REGISTER_ROUTING_KEY:
            const profile = JSON.parse(msg.content.toString());
            break;
          case RoutingKeys.SIGNIN_ROUTING_KEY:
            const user = JSON.parse(msg.content.toString());
            break;
          case RoutingKeys.LS_SIGNIN_ACCEPTED_KEY:
            break;
        }
      },
      { priority: 1, noAck: true, noLocal: true },
    );
  }

  async onApplicationBootstrap() {
    await this.bindRegisterQueue();
    await this.bindSignInQueue();
    await this.bindSignInAcceptedQueue();
    this.consume();
  }
}
