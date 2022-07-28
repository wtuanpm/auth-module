import { OnApplicationBootstrap } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements
    OnApplicationBootstrap,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  afterInit(server: any) {}
  handleConnection(client: any, ...args: any[]) {
    console.log('OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect ');
  }
  handleDisconnect(client: any) {
    console.log('client ', client.id);
  }
  onApplicationBootstrap() {
    this.server.on('disconnect', () => {
      console.log('aa');
    });
  }
  @WebSocketServer()
  server: Server;

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

  @SubscribeMessage('disconnected')
  async disconnect() {
    console.log('disconnect');
  }

  // @SubscribeMessage
}
