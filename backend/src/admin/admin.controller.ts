import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import { AdminSessionGuard } from '../auth/admin-session.guard';
import { AuthenticatedRequest } from '../auth/auth.types';
import { AdminService } from './admin.service';
import { ConsultationQueryDto, CreateAdminDto, CreateContactDto, CreateNoteDto, UpdateAdminDto, UpdateStatusDto } from './dto/admin.dto';

@Controller('admin')
@UseGuards(AdminSessionGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('consultations') list(@Query() query: ConsultationQueryDto, @Req() req: AuthenticatedRequest) { return this.service.consultations(query, req.admin.id, req.ip); }
  @Get('consultations/:id') detail(@Param('id') id: string, @Req() req: AuthenticatedRequest) { return this.service.consultation(id, req.admin.id, req.ip); }
  @Patch('consultations/:id/status') status(@Param('id') id: string, @Body() dto: UpdateStatusDto, @Req() req: AuthenticatedRequest) { return this.service.updateStatus(id, dto, req.admin.id, req.ip); }
  @Post('consultations/:id/notes') note(@Param('id') id: string, @Body() dto: CreateNoteDto, @Req() req: AuthenticatedRequest) { return this.service.addNote(id, dto, req.admin.id, req.ip); }
  @Post('consultations/:id/contacts') contact(@Param('id') id: string, @Body() dto: CreateContactDto, @Req() req: AuthenticatedRequest) { return this.service.addContact(id, dto, req.admin.id, req.ip); }
  @Delete('consultations/:id') @HttpCode(204) remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) { this.requireManager(req); return this.service.deleteConsultation(id, req.admin.id, req.ip); }

  @Get('users') users(@Req() req: AuthenticatedRequest) { this.requireSuperAdmin(req); return this.service.admins(); }
  @Post('users') createUser(@Body() dto: CreateAdminDto, @Req() req: AuthenticatedRequest) { this.requireSuperAdmin(req); return this.service.createAdmin(dto, req.admin.id, req.ip); }
  @Patch('users/:id') updateUser(@Param('id') id: string, @Body() dto: UpdateAdminDto, @Req() req: AuthenticatedRequest) { this.requireSuperAdmin(req); return this.service.updateAdmin(id, dto, req.admin.id, req.ip); }
  @Get('audit-logs') logs(@Req() req: AuthenticatedRequest) { this.requireManager(req); return this.service.auditLogs(req.admin.id, req.ip); }

  private requireManager(req: AuthenticatedRequest) { if (req.admin.role === AdminRole.CONSULTANT) throw new ForbiddenException('관리자 권한이 필요합니다.'); }
  private requireSuperAdmin(req: AuthenticatedRequest) { if (req.admin.role !== AdminRole.SUPER_ADMIN) throw new ForbiddenException('최고 관리자 권한이 필요합니다.'); }
}

