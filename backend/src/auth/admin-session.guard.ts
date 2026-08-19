import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedRequest } from './auth.types';

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly auth: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.admin_session as string | undefined;
    if (!token) throw new UnauthorizedException('관리자 로그인이 필요합니다.');
    const session = await this.prisma.adminSession.findUnique({ where: { tokenHash: this.auth.hashToken(token) }, include: { admin: true } });
    if (!session || session.revokedAt || session.expiresAt <= new Date() || !session.admin.isActive) throw new UnauthorizedException('세션이 만료되었습니다.');
    Object.assign(request as AuthenticatedRequest, {
      admin: { id: session.admin.id, email: session.admin.email, displayName: session.admin.displayName, role: session.admin.role },
      sessionId: session.id,
    });
    if (Date.now() - session.lastUsedAt.getTime() > 5 * 60 * 1000) await this.prisma.adminSession.update({ where: { id: session.id }, data: { lastUsedAt: new Date() } });
    return true;
  }
}

