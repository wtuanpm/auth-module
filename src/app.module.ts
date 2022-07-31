import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { GatewayModule } from './gateways/gateway.module';

@Module({
  imports: [AppConfigModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
