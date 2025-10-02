import { Module } from '@nestjs/common';
import { ConnectionOptions, Queue } from 'bullmq';
import { RedisProvider } from 'src/redis/redis.provider';

@Module({
  providers: [
    RedisProvider,
    {
      provide: 'QUEUE_SERVICE',
      inject: ['REDIS_CLIENT'],
      useFactory: (connection: ConnectionOptions) => {
        return new Queue('secret-cleanup', { connection });
      },
    },
  ],
  exports: ['QUEUE_SERVICE'],
})
export class QueueModule {}
