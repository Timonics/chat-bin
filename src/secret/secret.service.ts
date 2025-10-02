import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';
import { REDIS_CLIENT } from 'src/redis/redis.provider';
import { ConnectionOptions, Queue } from 'bullmq';

@Injectable()
export class SecretService implements OnModuleInit {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey: Buffer;
  private readonly cleanUpQueue: Queue;

  constructor(
    private prismaService: PrismaService,
    @Inject(REDIS_CLIENT) private readonly connection: ConnectionOptions,
  ) {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error('SECRET_KEY not set in environment variables');
    }
    this.secretKey = Buffer.from(secret, 'hex');
    if (this.secretKey.length !== 32) {
      throw new Error('SECRET_KEY must be 32 bytes in hex format');
    }
    this.cleanUpQueue = new Queue('secret-cleanup', {
      connection: this.connection,
    });
  }

  async onModuleInit() {
    await this.cleanUpQueue.add(
      'batch-cleanup',
      {},
      {
        repeat: { every: 5 * 60 * 1000 },
        removeOnComplete: true,
      },
    );
  }

  private encryptText(text: string) {
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

  private decryptText(encryptedText: string, iv: string, authTag: string) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(iv, 'hex'),
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  generateAccessToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  async createSecret(text: string, remainingViews: number, expiresAt: number) {
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

    await this.cleanUpQueue.add(
      'delete-expired-secret',
      { accessToken },
      { delay: expiresAt * 60 * 1000 },
    );

    return {accessToken};
  }

  async getSecret(id: number, accessToken: string) {

    const Id = Number(id);
    if (isNaN(id)) throw new Error('Invalid ID format');

    const secret = await this.prismaService.secret.findUnique({
      where: { id: Id, accessToken },
    });

    if (!secret) throw new Error('Secret not found');
    if (secret.remainingViews <= 0) throw new Error('No remaining views');
    if (new Date() > secret.expiresAt) throw new Error('Secret has expired');

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
}
