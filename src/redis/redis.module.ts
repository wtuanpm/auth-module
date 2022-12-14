import { Global, Module } from '@nestjs/common';
import { REDIS } from 'src/common/providers/key.provider';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { createClient } from 'redis';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: REDIS,
      useFactory: async (appConfig: AppConfigService) => {
        const client = createClient({
          url: appConfig.redisUrl,
          password: appConfig.redisPass,
        });

        client.on('error', (err) => console.log('Redis Client Error', err));

        await client.connect();

        return client;
      },
      inject: [AppConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
