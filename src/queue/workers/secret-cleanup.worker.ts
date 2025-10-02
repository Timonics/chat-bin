import { ConnectionOptions, Worker } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

export function startSecretCleanupWorker(
  prismaService: PrismaService,
  connection: ConnectionOptions,
) {
  const worker = new Worker(
    'secret-cleanup',
    async (job) => {
      if (job.name === 'batch-cleanup') {
        const now = new Date();
        const result = await prismaService.secret.deleteMany({
          where: { expiresAt: { lt: now } },
        });
        console.log(`[Batch Cleanup] Deleted ${result.count} expired secrets`);
      }

      if (job.name === 'delete-expired-secret') {
        const { accessToken } = job.data;
        const result = await prismaService.secret.deleteMany({
          where: { accessToken, expiresAt: { lt: new Date() } },
        });
        console.log(`[Single Cleanup] Deleted ${result.count} secrets for token ${accessToken}`);
      }
    },
    { connection },
  );

  worker.on('completed', (job) => {
    console.log(`Cleanup job ${job.id} completed`);
  });

  worker.on('failed', (_, err) => {
    console.error(`Cleanup job failed: ${err.message}`);
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  return worker;
}
