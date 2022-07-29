import { OnApplicationBootstrap, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { WsGuard } from 'src/auth/guard/ws.guard';
import { AppConfigService } from 'src/config/config.service';
import { verifyJwt } from 'src/util/jwt';

@WebSocketGateway({ cors: '*:*' })
export class SocketGateway
  implements
    OnApplicationBootstrap,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  @UseGuards(WsGuard)
  afterInit(server: any) {}

  handleConnection(client, ...args: any[]) {
    try {
      const authorizationToken =
        client['handshake']['headers']['authorization'];
      const decoded = verifyJwt(authorizationToken);
      console.log('decoded', decoded);
    } catch (err) {
      client.emit('exception', { error: 'Unauthorized' });
      client.disconnect();
    }
  }
  handleDisconnect(client: any) {
    console.log('Disconnected ', client.id);
  }
  onApplicationBootstrap() {
    this.server.on('disconnect', () => {
      console.log('disconnected');
    });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('data', data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log('identity', data);
    return data;
  }
}
