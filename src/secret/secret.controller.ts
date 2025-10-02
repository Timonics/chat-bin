import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SecretService } from './secret.service';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

class CreateSecretDto {
  message: string;
  remainingViews: number;
  expiresAt: number;
}

@ApiTags('Secrets')
@Controller('secret')
export class SecretController {
  constructor(private readonly secretService: SecretService) {}

  @Post('message')
  @ApiBody({ type: CreateSecretDto })
  @ApiResponse({ status: 201, description: 'Secret created successfully.' })
  async createSecret(@Body() dto: CreateSecretDto) {
    return this.secretService.createSecret(
      dto.message,
      dto.remainingViews,
      dto.expiresAt,
    );
  }
  
  @Get('message/:id')
  @ApiParam({ name: 'id', type: Number, description: 'Secret identifier' })
  @ApiQuery({ name: 'token', type: String, required: true })
  @ApiResponse({ status: 200, description: 'Secret retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Secret not found or expired.' })
  async getSecret(@Param('id') id: number, @Query('token') token: string) {
    return this.secretService.getSecret(id, token);
  }
  
  @Delete('messages/cleanup')
  @ApiResponse({ status: 200, description: 'Cleanup job triggered.' })
  async cleanupSecrets() {
    await this.secretService.deleteExpiredSecrets();
    return { message: 'Cleanup job triggered' };
  }
}
