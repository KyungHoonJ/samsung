import { Module } from '@nestjs/common';
import { AdminSessionGuard } from './admin-session.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({ controllers: [AuthController], providers: [AuthService, AdminSessionGuard], exports: [AuthService, AdminSessionGuard] })
export class AuthModule {}
