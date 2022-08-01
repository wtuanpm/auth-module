import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Channel, ConsumeMessage } from 'amqplib';
import { channel } from 'diagnostics_channel';
import { Server } from 'http';
import {
  RedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from 'redis';
import { BlackListService } from 'src/black-list/services/implements/black-list.service';
import { RabbitKeys, RoutingKeys } from 'src/common/constants/keys/rabbit.key';
import { RABBIT_MQ, REDIS } from 'src/common/providers/key.provider';
import { SocketGateway } from 'src/gateways/gateway';
import { UserTokenService } from 'src/user-token/services/implements/user-token.service';
import { createKey, parseJwt } from 'src/util/jwt';
import { createClientIdKey } from 'src/util/socket-client';

export class RabbitSubscribers implements OnApplicationBootstrap {
  constructor(
    @Inject(RABBIT_MQ) private readonly channel: Channel,
    private readonly blackListService: BlackListService,
    private readonly userTokenService: UserTokenService,
    @Inject(REDIS)
    private readonly redisClient: RedisClientType<
      RedisModules,
      RedisFunctions,
      RedisScripts
    >,
    private readonly socketGateway: SocketGateway,
  ) {}

  bindRegisterQueue() {
    return this.channel.bindQueue(
      RabbitKeys.RMQ_WS_TRAVEL_AUTH_QUEUE,
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.REGISTER_ROUTING_KEY,
    );
  }

  bindSignInQueue() {
    return this.channel.bindQueue(
      RabbitKeys.RMQ_WS_TRAVEL_AUTH_QUEUE,
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.SIGNIN_ROUTING_KEY,
    );
  }

  bindSignInAcceptedQueue() {
    return this.channel.bindQueue(
      RabbitKeys.RMQ_WS_TRAVEL_AUTH_QUEUE,
      RabbitKeys.RMQ_EXCHANGE,
      RoutingKeys.LS_SIGNIN_ACCEPTED_KEY,
    );
  }

  async consume() {
    await this.channel.consume(
      RabbitKeys.RMQ_WS_TRAVEL_AUTH_QUEUE,
      async (msg: ConsumeMessage) => {
        switch (
          msg.fields.routingKey as RoutingKeys
          // case RoutingKeys.SIGNIN_ROUTING_KEY:
          //   const user = JSON.parse(msg.content.toString());
          //   const jti = parseJwt(user.AccessToken).jti;
          //   const oldUser = await this.userTokenService.getById(user.Id);
          //   if (oldUser && oldUser.isActive) {
          //     const clientIdKey = createClientIdKey(oldUser.tokenId);
          //     const clientId = await this.redisClient
          //     this.socketGateway.emitAMessage('events', {
          //       data: 'hello',
          //     });
          //     const blockedKey = createKey(oldUser.tokenId);
          //     const blocked = await this.redisClient.get(blockedKey);
          //   } else if (oldUser && !oldUser.isActive) {
          //     const blockedKey = createKey(oldUser.tokenId);
          //     const blocked = await this.redisClient.get(blockedKey);
          //     if (!blocked) {
          //       await this.redisClient.set(blockedKey, oldUser.tokenId);
          //       await this.blackListService.addToBlackList(
          //         blockedKey,
          //         oldUser.tokenId,
          //       );
          //     }
          //     await this.userTokenService.create(
          //       user.Id,
          //       jti,
          //       user.DeviceToken,
          //     );
          //   } else {
          //     await this.userTokenService.create(
          //       user.Id,
          //       jti,
          //       user.DeviceToken || 'abcd',
          //     );
          //   }
          //   break;
          // case RoutingKeys.LS_SIGNIN_ACCEPTED_KEY:
          //   const authPayload = JSON.parse(msg.content.toString());

          //   const tokenId = parseJwt(authPayload.AccessToken).jti;

          //   const logged = await this.userTokenService.getById(authPayload.Id);

          //   console.log(logged);

          //   const jtiBlockKey = createKey(logged.tokenId);

          //   console.log(jtiBlockKey);

          //   await this.blackListService.addToBlackList(
          //     logged.tokenId,
          //     logged.tokenId,
          //   );

          //   await this.redisClient.set(jtiBlockKey, logged.tokenId);

          //   await this.userTokenService.remove(logged.userId);

          //   await this.userTokenService.create(
          //     authPayload.Id,
          //     tokenId,
          //     authPayload.DeviceToken || 'abcbcbc',
          //   );

          //   break;
        ) {
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
