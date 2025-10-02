import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { ConnectionOptions } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisProvider, REDIS_CLIENT } from 'src/redis/redis.provider';
import { startSecretCleanupWorker } from './secret-cleanup.worker';

@Module({
  providers: [PrismaService, RedisProvider],
})
export class SecretCleanupModule implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly connection: ConnectionOptions,
  ) {}

  async onModuleInit() {
    startSecretCleanupWorker(this.prisma, this.connection);
  }
}
