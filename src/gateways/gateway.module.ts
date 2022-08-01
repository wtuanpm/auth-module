import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackListService } from 'src/black-list/services/implements/black-list.service';
import { BlackList } from 'src/database/entities/blacklist.entity';
import { UserTokens } from 'src/database/entities/user-token.entity';
import { UserTokenService } from 'src/user-token/services/implements/user-token.service';
import { UserTokenModule } from 'src/user-token/user-token.module';
import { SocketGateway } from './gateway';

@Module({
  imports: [TypeOrmModule.forFeature([UserTokens, BlackList])],
  providers: [SocketGateway, UserTokenService, BlackListService],
  exports: [SocketGateway],
})
export class GatewayModule {}
