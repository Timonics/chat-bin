import { Module } from '@nestjs/common';
import { SecretController } from './secret/secret.controller';
import { SecretModule } from './secret/secret.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisProvider } from './redis/redis.provider';
import { QueueModule } from './queue/queue.module';
import { SecretCleanupModule } from './queue/workers/secret-cleanup.module';

@Module({
  imports: [SecretModule, PrismaModule, QueueModule, SecretCleanupModule],
  controllers: [SecretController],
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class AppModule {}
