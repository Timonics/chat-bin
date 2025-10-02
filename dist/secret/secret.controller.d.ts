import { SecretService } from './secret.service';
declare class CreateSecretDto {
    message: string;
    remainingViews: number;
    expiresAt: number;
}
export declare class SecretController {
    private readonly secretService;
    constructor(secretService: SecretService);
    createSecret(dto: CreateSecretDto): Promise<{
        accessToken: string;
    }>;
    getSecret(id: number, token: string): Promise<{
        text: string;
        remainingViews: number;
    }>;
    cleanupSecrets(): Promise<{
        message: string;
    }>;
}
export {};
