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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class RedisService implements IRedisService {
  constructor(
    @Inject(REDIS)
    private readonly redisClient: RedisClientType<
      RedisModules,
      RedisFunctions,
      RedisScripts
    >,
    @InjectRepository(BlackList)
    private readonly blackListRepository: Repository<BlackList>,
  ) {}
  async addToBlackList(tokenId: string): Promise<BlackList> {
    await this.redisClient.set(`bl_${tokenId}`, tokenId);

    const created = this.blackListRepository.create({
      tokenId: tokenId,
    });

    const result = await this.blackListRepository.save(created);

    return result;
  }
}
