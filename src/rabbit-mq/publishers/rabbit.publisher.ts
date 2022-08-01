import { Inject } from '@nestjs/common';
import { ConfirmChannel } from 'amqplib';
import { RabbitKeys, RoutingKeys } from 'src/common/constants/keys/rabbit.key';
import { RABBIT_MQ } from 'src/common/providers/key.provider';

export class RabbitPublishers {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbitClient: ConfirmChannel,
  ) {}

  loginAcceptedPublisher(
    username: string,
    password: string,
    deviceToken: string,
  ) {
    const body = {
      username: username,
      password: password,
      deviceToken: deviceToken,
    };

    const message = Buffer.from(JSON.stringify(body));

    this.rabbitClient.publish(
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.SIGNIN_ACCEPTED_KEY,
      message,
    );
  }
}
