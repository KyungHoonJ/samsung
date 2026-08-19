import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AdminSessionGuard } from './admin-session.guard';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './auth.types';
import { LoginDto } from './dto/login.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login') @HttpCode(200) @Throttle({ default: { ttl: 60_000, limit: 5 } })
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto.email, dto.password, req.ip);
    res.cookie('admin_session', result.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', expires: result.expiresAt, path: '/' });
    return { admin: result.admin };
  }

  @Get('me') @UseGuards(AdminSessionGuard)
  me(@Req() req: AuthenticatedRequest) { return { admin: req.admin }; }

  @Post('logout') @HttpCode(204) @UseGuards(AdminSessionGuard)
  async logout(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(req.sessionId, req.admin.id, req.ip);
    res.clearCookie('admin_session', { path: '/' });
  }
}

