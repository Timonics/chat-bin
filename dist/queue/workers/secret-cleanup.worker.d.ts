import { ConnectionOptions, Worker } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';
export declare function startSecretCleanupWorker(prismaService: PrismaService, connection: ConnectionOptions): Worker<any, any, string>;
