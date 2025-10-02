import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectionOptions } from 'bullmq';
export declare class SecretService implements OnModuleInit {
    private prismaService;
    private readonly connection;
    private readonly algorithm;
    private readonly secretKey;
    private readonly cleanUpQueue;
    constructor(prismaService: PrismaService, connection: ConnectionOptions);
    onModuleInit(): Promise<void>;
    private encryptText;
    private decryptText;
    generateAccessToken(): string;
    createSecret(text: string, remainingViews: number, expiresAt: number): Promise<{
        accessToken: string;
    }>;
    getSecret(id: number, accessToken: string): Promise<{
        text: string;
        remainingViews: number;
    }>;
    deleteExpiredSecrets(): Promise<void>;
}
