import { InjectRepository } from '@nestjs/typeorm';
import { BlackList } from 'src/database/entities/blacklist.entity';
import { IBlackListService } from '../interfaces/black-list-service.interface';
import { Repository } from 'typeorm';

export class BlackListService implements IBlackListService {
  constructor(
    @InjectRepository(BlackList)
    private readonly blackListRepository: Repository<BlackList>,
  ) {}
  async addToBlackList(key: string, tokenId: string): Promise<BlackList> {
    const created = this.blackListRepository.create({
      key: key,
      tokenId: tokenId,
    });

    const result = await this.blackListRepository.save(created);

    return result;
  }
  async remove(key: string): Promise<BlackList> {
    const entity = await this.blackListRepository.findOne({
      where: {
        key: key,
      },
    });
    const result = await this.blackListRepository.remove(entity);
    return result;
  }
}
