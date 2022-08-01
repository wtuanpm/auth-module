import { UserTokens } from 'src/database/entities/user-token.entity';

export interface IUserTokenService {
  create(
    userId: string,
    tokenId: string,
    deviceToken: string,
  ): Promise<UserTokens>;

  remove(userId: string): Promise<UserTokens>;

  getById(userId: string): Promise<UserTokens>;

  updateStatus(userId: string, isActive: boolean): Promise<UserTokens>;

  updateUserToken(
    userId: string,
    tokenId: string,
    deviceToken: string,
  ): Promise<UserTokens>;
}
