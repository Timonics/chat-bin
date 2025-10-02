import { Module } from '@nestjs/common';
import { SecretService } from './secret.service';
import { RedisProvider } from 'src/redis/redis.provider';

@Module({
  providers: [SecretService, RedisProvider],
  exports: [SecretService],
})
export class SecretModule {}
