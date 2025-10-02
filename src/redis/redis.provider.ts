import { Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (): Redis => {
    const logger = new Logger('REDIS PROVIDER');

    const redis = new Redis({
      host: process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    redis.on('connect', () => {
      logger.log('Connected to Redis');
    });

    redis.on('error', (error) => {
      logger.error('Redis connection error', error);
    });

    return redis;
  },
};
