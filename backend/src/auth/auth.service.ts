import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { compare } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  hashToken(token: string) { return createHash('sha256').update(token).digest('hex'); }

  async login(emailInput: string, password: string, ipAddress?: string) {
    const email = emailInput.toLowerCase().trim();
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.isActive || !(await compare(password, admin.passwordHash))) {
      await this.prisma.auditLog.create({ data: { action: AuditAction.LOGIN_FAILED, targetType: 'Admin', metadata: { email }, ipAddress } });
      throw new UnauthorizedException('이메일 또는 비밀번호를 확인해 주세요.');
    }
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await this.prisma.$transaction([
      this.prisma.adminSession.create({ data: { adminId: admin.id, tokenHash: this.hashToken(token), expiresAt } }),
      this.prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } }),
      this.prisma.auditLog.create({ data: { adminId: admin.id, action: AuditAction.LOGIN, targetType: 'Admin', targetId: admin.id, ipAddress } }),
    ]);
    return { token, expiresAt, admin: { id: admin.id, email: admin.email, displayName: admin.displayName, role: admin.role } };
  }

  async logout(sessionId: string, adminId: string, ipAddress?: string) {
    await this.prisma.$transaction([
      this.prisma.adminSession.update({ where: { id: sessionId }, data: { revokedAt: new Date() } }),
      this.prisma.auditLog.create({ data: { adminId, action: AuditAction.LOGOUT, targetType: 'AdminSession', targetId: sessionId, ipAddress } }),
    ]);
  }
}

