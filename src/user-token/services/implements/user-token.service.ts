import { InjectRepository } from '@nestjs/typeorm';
import { UserTokens } from 'src/database/entities/user-token.entity';
import { Repository } from 'typeorm';
import { IUserTokenService } from '../interfaces/user-token-service.interface';

export class UserTokenService implements IUserTokenService {
  constructor(
    @InjectRepository(UserTokens)
    private readonly userTokenRepository: Repository<UserTokens>,
  ) {}
  async updateUserToken(
    userId: string,
    tokenId: string,
    deviceToken: string,
  ): Promise<UserTokens> {
    const user = await this.userTokenRepository.findOne({
      where: {
        userId: userId,
      },
    });

    user.tokenId = tokenId;
    user.deviceToken = deviceToken;

    const result = await this.userTokenRepository.save(user);

    return result;
  }
  async updateStatus(userId: string, isActive: boolean) {
    const user = await this.userTokenRepository.findOne({
      where: {
        userId: userId,
      },
    });
    user.isActive = isActive;

    const result = await this.userTokenRepository.save(user);

    return result;
  }
  async remove(userId: string): Promise<UserTokens> {
    const user = await this.userTokenRepository.findOne({
      where: {
        userId: userId,
      },
    });

    const result = await this.userTokenRepository.remove(user);

    return result;
  }
  async getById(userId: string): Promise<UserTokens> {
    const result = await this.userTokenRepository.findOne({
      where: {
        userId: userId,
      },
    });

    return result;
  }

  async create(
    userId: string,
    tokenId: string,
    deviceToken: string,
  ): Promise<UserTokens> {
    const created = this.userTokenRepository.create({
      userId: userId,
      tokenId: tokenId,
      deviceToken: deviceToken,
      isActive: true,
    });

    const result = await this.userTokenRepository.save(created);

    return result;
  }
}
