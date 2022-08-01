import { Inject } from '@nestjs/common';
import { REDIS } from 'src/common/providers/key.provider';
import { IRedisService } from '../interfaces/redis.interface';
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';
import { BlackList } from 'src/database/entities/blacklist.entity';
import { BlackListService } from 'src/black-list/services/implements/black-list.service';
import { createKey } from 'src/util/jwt';

export class RedisService implements IRedisService {
  constructor(
    @Inject(REDIS)
    private readonly redisClient: RedisClientType<
      RedisModules,
      RedisFunctions,
      RedisScripts
    >,
    private readonly blackListService: BlackListService,
  ) {}
  async addToBlackList(tokenId: string): Promise<BlackList> {
    const key = createKey(tokenId);

    await this.redisClient.set(key, tokenId);

    const result = this.blackListService.addToBlackList(key, tokenId);

    return result;
  }
}
