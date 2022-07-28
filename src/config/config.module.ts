import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';

@Module({
  imports: [ConfigModule.forRoot({})],
  providers: [ConfigService, AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
