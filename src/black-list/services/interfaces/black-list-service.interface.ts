import { BlackList } from 'src/database/entities/blacklist.entity';

export interface IBlackListService {
  addToBlackList(key: string, value: string): Promise<BlackList>;
  remove(key: string): Promise<BlackList>;
}
