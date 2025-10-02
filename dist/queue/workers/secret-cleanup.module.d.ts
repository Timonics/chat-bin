import { OnModuleInit } from '@nestjs/common';
import { ConnectionOptions } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class SecretCleanupModule implements OnModuleInit {
    private readonly prisma;
    private readonly connection;
    constructor(prisma: PrismaService, connection: ConnectionOptions);
    onModuleInit(): Promise<void>;
}
