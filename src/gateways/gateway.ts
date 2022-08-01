import { Inject, Injectable, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { use } from 'passport';
import {
  RedisClientType,
  RedisModules,
  RedisFunctions,
  RedisScripts,
} from 'redis';
import { Server } from 'socket.io';
import { WsGuard } from 'src/auth/guard/ws.guard';
import { BlackListService } from 'src/black-list/services/implements/black-list.service';
import { JwtPayload } from 'src/common/constants/object-types/jwt.object-type';
import { REDIS } from 'src/common/providers/key.provider';
import { UserTokenService } from 'src/user-token/services/implements/user-token.service';
import { createKey, verifyJwt } from 'src/util/jwt';
import { createClientIdKey } from 'src/util/socket-client';

@WebSocketGateway({ cors: '*:*' })
@Injectable()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(REDIS)
    private readonly redisClient: RedisClientType<
      RedisModules,
      RedisFunctions,
      RedisScripts
    >,
    private readonly userTokenService: UserTokenService,
    private readonly blackListService: BlackListService,
  ) {}
  @WebSocketServer()
  server: Server;

  @UseGuards(WsGuard)
  afterInit(server: any) {}

  async handleConnection(client, ...args: any[]) {
    try {
      //get author & devive token from client
      const authorizationToken =
        client['handshake']['headers']['authorization'];
      const deviceToken = client['handshake']['headers']['devicetoken'];
      const decoded = verifyJwt(authorizationToken) as JwtPayload;

      //store client id
      const clientIdKey = createClientIdKey(decoded.jti);
      await this.redisClient.set(clientIdKey, client.id);

      //find old user logged before
      const oldUser = await this.userTokenService.getById(
        decoded.nameIdentifier,
      );

      if (!oldUser) {
        //create new if not existed
        await this.userTokenService.create(
          decoded.nameIdentifier,
          decoded.jti,
          deviceToken,
        );
      } else if (oldUser && deviceToken != oldUser.deviceToken) {
        //publish message to new user client if old user is existed
        await this.publishMessage(
          'publishToNewUser',
          'You are currently logged in on another device. You will be logged out of the other device and connected on your current one. Proceed?',
          client.id,
        );
      }
    } catch (err) {
      client.emit('exception', { error: 'Unauthorized' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: any) {
    const authorizationToken = client['handshake']['headers']['authorization'];
    const decoded = verifyJwt(authorizationToken) as JwtPayload;

    //clear cache
    const clientIdKey = createClientIdKey(decoded.jti);
    await this.redisClient.del(clientIdKey);
    console.log('Disconnected ', client.id);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('publishMessageToOldUser')
  async publishMessageToOldUser(client: Socket) {
    //get authorization vs devicetoken from client request
    const authorizationToken = client['handshake']['headers']['authorization'];
    const deviceToken = client['handshake']['headers']['devicetoken'];
    const decoded = verifyJwt(authorizationToken) as JwtPayload;

    //get old user
    const user = await this.userTokenService.getById(decoded.nameIdentifier);

    console.log(user);

    //add token to blacklist
    const clientIdKey = createClientIdKey(user.tokenId);
    const tokenBlockKey = createKey(user.tokenId);
    await this.redisClient.set(tokenBlockKey, user.tokenId);
    await this.blackListService.addToBlackList(tokenBlockKey, user.tokenId);
    //get client from cache and push message to client by id
    const clientId = await this.redisClient.get(clientIdKey);

    await this.publishMessage(
      'publishToNewUser',
      'You are logging in on another device',
      clientId,
    );

    //update new user info
    await this.userTokenService.updateUserToken(
      user.userId,
      decoded.jti,
      deviceToken,
    );
  }

  async publishMessage(eventName: string, data: string, clientId: string) {
    this.server.to(clientId).emit(eventName, data);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('logout')
  async logOut(client: Socket) {
    //get authorization vs devicetoken from client request
    const authorizationToken = client['handshake']['headers']['authorization'];

    const decoded = verifyJwt(authorizationToken) as JwtPayload;

    //remove old user
    await this.userTokenService.remove(decoded.nameIdentifier);

    //add token to blacklist
    const tokenBlockKey = createKey(decoded.jti);
    await this.redisClient.set(tokenBlockKey, decoded.jti);
    await this.blackListService.addToBlackList(tokenBlockKey, decoded.jti);
  }
}
