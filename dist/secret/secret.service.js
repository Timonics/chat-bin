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
exports.SecretService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = require("crypto");
const redis_provider_1 = require("../redis/redis.provider");
const bullmq_1 = require("bullmq");
let SecretService = class SecretService {
    prismaService;
    connection;
    algorithm = 'aes-256-gcm';
    secretKey;
    cleanUpQueue;
    constructor(prismaService, connection) {
        this.prismaService = prismaService;
        this.connection = connection;
        const secret = process.env.SECRET_KEY;
        if (!secret) {
            throw new Error('SECRET_KEY not set in environment variables');
        }
        this.secretKey = Buffer.from(secret, 'hex');
        if (this.secretKey.length !== 32) {
            throw new Error('SECRET_KEY must be 32 bytes in hex format');
        }
        this.cleanUpQueue = new bullmq_1.Queue('secret-cleanup', {
            connection: this.connection,
        });
    }
    async onModuleInit() {
        await this.cleanUpQueue.add('batch-cleanup', {}, {
            repeat: { every: 5 * 60 * 1000 },
            removeOnComplete: true,
        });
    }
    encryptText(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return {
            encryptedText: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
        };
    }
    decryptText(encryptedText, iv, authTag) {
        const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(iv, 'hex'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    generateAccessToken() {
        return crypto.randomBytes(16).toString('hex');
    }
    async createSecret(text, remainingViews, expiresAt) {
        const { encryptedText, iv, authTag } = this.encryptText(text);
        const accessToken = this.generateAccessToken();
        const expirationDate = new Date(Date.now() + expiresAt * 60000);
        await this.prismaService.secret.create({
            data: {
                encryptedText: `${encryptedText}:${iv}:${authTag}`,
                accessToken,
                remainingViews,
                expiresAt: expirationDate,
            },
        });
        await this.cleanUpQueue.add('delete-expired-secret', { accessToken }, { delay: expiresAt * 60 * 1000 });
        return { accessToken };
    }
    async getSecret(id, accessToken) {
        const Id = Number(id);
        if (isNaN(id))
            throw new Error('Invalid ID format');
        const secret = await this.prismaService.secret.findUnique({
            where: { id: Id, accessToken },
        });
        if (!secret)
            throw new Error('Secret not found');
        if (secret.remainingViews <= 0)
            throw new Error('No remaining views');
        if (new Date() > secret.expiresAt)
            throw new Error('Secret has expired');
        const [encryptedText, iv, authTag] = secret.encryptedText.split(':');
        const decryptedText = this.decryptText(encryptedText, iv, authTag);
        await this.prismaService.secret.update({
            where: { id: Id, accessToken },
            data: { remainingViews: secret.remainingViews - 1 },
        });
        return { text: decryptedText, remainingViews: secret.remainingViews - 1 };
    }
    async deleteExpiredSecrets() {
        const now = new Date();
        await this.prismaService.secret.deleteMany({
            where: { expiresAt: { lt: now } },
        });
    }
};
exports.SecretService = SecretService;
exports.SecretService = SecretService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(redis_provider_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], SecretService);
//# sourceMappingURL=secret.service.js.map