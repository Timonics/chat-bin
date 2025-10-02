"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretCleanupModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_provider_1 = require("../../redis/redis.provider");
const secret_cleanup_worker_1 = require("./secret-cleanup.worker");
let SecretCleanupModule = class SecretCleanupModule {
    prisma;
    connection;
    constructor(prisma, connection) {
        this.prisma = prisma;
        this.connection = connection;
    }
    async onModuleInit() {
        (0, secret_cleanup_worker_1.startSecretCleanupWorker)(this.prisma, this.connection);
    }
};
exports.SecretCleanupModule = SecretCleanupModule;
exports.SecretCleanupModule = SecretCleanupModule = __decorate([
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService, redis_provider_1.RedisProvider],
    }),
    __param(1, (0, common_1.Inject)(redis_provider_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], SecretCleanupModule);
//# sourceMappingURL=secret-cleanup.module.js.map