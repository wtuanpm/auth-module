import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokens } from 'src/database/entities/user-token.entity';
import { UserTokenService } from './services/implements/user-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTokens])],
  providers: [UserTokenService],
  exports: [UserTokenService],
})
export class UserTokenModule {}
