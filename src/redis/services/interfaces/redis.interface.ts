import { BlackList } from 'src/database/entities/blacklist.entity';

export interface IRedisService {
  addToBlackList(tokenId: string): Promise<BlackList>;
}
