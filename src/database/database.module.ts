import { Module } from '@nestjs/common';
import { REDIS } from 'src/common/providers/key.provider';
import { AppConfigModule } from 'src/config/config.module';
import { AppConfigService } from 'src/config/config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BlackList } from './entities/blacklist.entity';
import { UserTokens } from './entities/user-token.entity';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: async (appConfig: AppConfigService) => {
        console.log(appConfig.dbPort);
        const moduleOptions: TypeOrmModuleOptions = {
          type: 'postgres',
          host: appConfig.dbHost,
          port: Number(appConfig.dbPort),
          username: appConfig.dbUser,
          password: appConfig.dbPass,
          database: appConfig.dbName,
          synchronize: false,
          entities: [BlackList, UserTokens],
        };

        return moduleOptions;
      },
    }),
  ],
})
export class GatewayModule {}
