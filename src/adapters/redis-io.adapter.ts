import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsException } from '@nestjs/websockets';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(redisConfig: {
    url: string;
    password?: string;
  }): Promise<void> {
    const { password, url } = redisConfig;

    const pubClient = createClient({
      url,
      password,
    });

    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, option?: ServerOptions): any {
    const server = super.createIOServer(port, option);
    server.adapter(this.adapterConstructor);
    // server.use((socket, next) => {
    //   console.log('Run here');
    //   next(new WsException('Unauthorized'));
    // });
    return server;
  }
}
