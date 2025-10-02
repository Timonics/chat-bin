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
exports.SecretController = void 0;
const common_1 = require("@nestjs/common");
const secret_service_1 = require("./secret.service");
const swagger_1 = require("@nestjs/swagger");
class CreateSecretDto {
    message;
    remainingViews;
    expiresAt;
}
let SecretController = class SecretController {
    secretService;
    constructor(secretService) {
        this.secretService = secretService;
    }
    async createSecret(dto) {
        return this.secretService.createSecret(dto.message, dto.remainingViews, dto.expiresAt);
    }
    async getSecret(id, token) {
        return this.secretService.getSecret(id, token);
    }
    async cleanupSecrets() {
        await this.secretService.deleteExpiredSecrets();
        return { message: 'Cleanup job triggered' };
    }
};
exports.SecretController = SecretController;
__decorate([
    (0, common_1.Post)('message'),
    (0, swagger_1.ApiBody)({ type: CreateSecretDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Secret created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSecretDto]),
    __metadata("design:returntype", Promise)
], SecretController.prototype, "createSecret", null);
__decorate([
    (0, common_1.Get)('message/:id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Secret identifier' }),
    (0, swagger_1.ApiQuery)({ name: 'token', type: String, required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Secret retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Secret not found or expired.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SecretController.prototype, "getSecret", null);
__decorate([
    (0, common_1.Delete)('messages/cleanup'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cleanup job triggered.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SecretController.prototype, "cleanupSecrets", null);
exports.SecretController = SecretController = __decorate([
    (0, swagger_1.ApiTags)('Secrets'),
    (0, common_1.Controller)('secret'),
    __metadata("design:paramtypes", [secret_service_1.SecretService])
], SecretController);
//# sourceMappingURL=secret.controller.js.map