import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get dbUser(): string {
    return this.configService.get('DB_USER');
  }

  get dbPass(): string {
    return this.configService.get('DB_PASS');
  }

  get dbHost(): string {
    return this.configService.get('DB_HOST');
  }

  get dbName(): string {
    return this.configService.get('DB_NAME');
  }

  get dbPort(): string {
    return this.configService.get('DB_PORT');
  }

  get appPort(): string {
    return this.configService.get('APP_PORT');
  }

  get redisUrl(): string {
    return this.configService.get('REDIS_URL');
  }

  get redisPass(): string {
    return this.configService.get('REDIS_PASS');
  }

  get redisPort(): string {
    return this.configService.get('REDIS_PORT');
  }

  get rmqUrl(): string {
    return this.configService.get('RABBIT_MQ_URL');
  }

  get jwtAssessTokenSecret(): string {
    return this.configService.get('JWT_ACCESS_TOKEN_SECRET');
  }

  get jwtRefreshTokenSecret(): string {
    return this.configService.get('JWT_REFRESH_TOKEN_SECRET');
  }
}
