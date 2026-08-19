import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EncryptionService } from '../encryption/encryption.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({ imports: [AuthModule], controllers: [AdminController], providers: [AdminService, EncryptionService] })
export class AdminModule {}
