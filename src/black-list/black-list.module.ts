import { Module } from '@nestjs/common';
import { REDIS } from 'src/common/providers/key.provider';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { createClient } from 'redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackList } from 'src/database/entities/blacklist.entity';
import { BlackListService } from './services/implements/black-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlackList])],
  providers: [BlackListService],
  exports: [BlackListService],
})
export class BlackListModule {}
