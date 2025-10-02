"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = exports.REDIS_CLIENT = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
exports.REDIS_CLIENT = 'REDIS_CLIENT';
exports.RedisProvider = {
    provide: exports.REDIS_CLIENT,
    useFactory: () => {
        const logger = new common_1.Logger('REDIS PROVIDER');
        const redis = new ioredis_1.default({
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
//# sourceMappingURL=redis.provider.js.map