import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminRole, AuditAction, Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConsultationQueryDto, CreateAdminDto, CreateContactDto, CreateNoteDto, UpdateAdminDto, UpdateStatusDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService, private readonly encryption: EncryptionService) {}

  private audit(adminId: string, action: AuditAction, targetType: string, targetId?: string, ipAddress?: string, metadata?: Prisma.InputJsonValue) {
    return this.prisma.auditLog.create({ data: { adminId, action, targetType, targetId, ipAddress, metadata } });
  }

  async consultations(query: ConsultationQueryDto, adminId: string, ipAddress?: string) {
    const where: Prisma.ConsultationWhereInput = { deletedAt: null };
    if (query.status) where.status = query.status;
    if (query.category) where.category = query.category;
    if (query.search) {
      const normalized = query.search.replace(/\D/g, '');
      where.OR = [
        { publicId: { contains: query.search } },
        ...(normalized.length >= 10 ? [{ phoneSearchHash: this.encryption.searchHash(normalized) }] : []),
      ];
    }
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.consultation.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit }),
      this.prisma.consultation.count({ where }),
    ]);
    await this.audit(adminId, AuditAction.VIEW_LIST, 'Consultation', undefined, ipAddress, { filters: { status: query.status ?? null, category: query.category ?? null } });
    return {
      items: rows.map(row => ({ id: row.id, publicId: row.publicId, category: row.category, name: this.encryption.decrypt(row.nameEncrypted), phoneMasked: this.maskPhone(this.encryption.decrypt(row.phoneEncrypted)), region: [row.regionLevel1, row.regionLevel2].filter(Boolean).join(' '), status: row.status, createdAt: row.createdAt })),
      total, page: query.page, limit: query.limit,
    };
  }

  async consultation(id: string, adminId: string, ipAddress?: string) {
    const row = await this.prisma.consultation.findFirst({ where: { id, deletedAt: null }, include: { notes: { include: { author: true }, orderBy: { createdAt: 'desc' } }, contactHistories: { include: { admin: true }, orderBy: { contactedAt: 'desc' } } } });
    if (!row) throw new NotFoundException('상담 신청을 찾을 수 없습니다.');
    await this.audit(adminId, AuditAction.VIEW_DETAIL, 'Consultation', id, ipAddress);
    return {
      id: row.id, publicId: row.publicId, category: row.category,
      name: this.encryption.decrypt(row.nameEncrypted), phone: this.encryption.decrypt(row.phoneEncrypted),
      regionLevel1: row.regionLevel1, regionLevel2: row.regionLevel2, preferredPlace: row.preferredPlace,
      preferredContactTime: row.preferredContactTime, inquiry: this.encryption.decrypt(row.inquiryEncrypted),
      status: row.status, privacyConsentVersion: row.privacyConsentVersion, privacyConsentAt: row.privacyConsentAt,
      retentionExpiresAt: row.retentionExpiresAt, createdAt: row.createdAt, updatedAt: row.updatedAt,
      notes: row.notes.map(note => ({ id: note.id, content: this.encryption.decrypt(note.contentEncrypted), author: note.author.displayName, createdAt: note.createdAt })),
      contacts: row.contactHistories.map(item => ({ id: item.id, type: item.type, result: item.result, contactedAt: item.contactedAt, admin: item.admin.displayName })),
    };
  }

  async updateStatus(id: string, dto: UpdateStatusDto, adminId: string, ipAddress?: string) {
    const updated = await this.prisma.consultation.update({ where: { id }, data: { status: dto.status } });
    await this.audit(adminId, AuditAction.UPDATE_STATUS, 'Consultation', id, ipAddress, { status: dto.status });
    return { status: updated.status };
  }

  async addNote(id: string, dto: CreateNoteDto, adminId: string, ipAddress?: string) {
    const note = await this.prisma.consultationNote.create({ data: { consultationId: id, authorAdminId: adminId, contentEncrypted: this.encryption.encrypt(dto.content.trim()) } });
    await this.audit(adminId, AuditAction.CREATE_NOTE, 'Consultation', id, ipAddress);
    return { id: note.id, createdAt: note.createdAt };
  }

  async addContact(id: string, dto: CreateContactDto, adminId: string, ipAddress?: string) {
    const contact = await this.prisma.contactHistory.create({ data: { consultationId: id, adminId, type: dto.type, result: dto.result, contactedAt: new Date(dto.contactedAt) } });
    await this.audit(adminId, AuditAction.CREATE_CONTACT, 'Consultation', id, ipAddress, { type: dto.type });
    return contact;
  }

  async deleteConsultation(id: string, adminId: string, ipAddress?: string) {
    await this.audit(adminId, AuditAction.DELETE_CONSULTATION, 'Consultation', id, ipAddress);
    await this.prisma.consultation.delete({ where: { id } });
  }

  admins() { return this.prisma.admin.findMany({ select: { id: true, email: true, displayName: true, role: true, isActive: true, lastLoginAt: true, createdAt: true }, orderBy: { createdAt: 'asc' } }); }

  async createAdmin(dto: CreateAdminDto, adminId: string, ipAddress?: string) {
    const created = await this.prisma.admin.create({ data: { email: dto.email.toLowerCase(), displayName: dto.displayName, role: dto.role, passwordHash: await hash(dto.password, 12) }, select: { id: true, email: true, displayName: true, role: true, isActive: true } });
    await this.audit(adminId, AuditAction.CREATE_ADMIN, 'Admin', created.id, ipAddress, { role: created.role });
    return created;
  }

  async updateAdmin(id: string, dto: UpdateAdminDto, adminId: string, ipAddress?: string) {
    const data: Prisma.AdminUpdateInput = { displayName: dto.displayName, role: dto.role, isActive: dto.isActive };
    if (dto.password) data.passwordHash = await hash(dto.password, 12);
    const updated = await this.prisma.admin.update({ where: { id }, data, select: { id: true, email: true, displayName: true, role: true, isActive: true } });
    if (dto.isActive === false) await this.prisma.adminSession.updateMany({ where: { adminId: id, revokedAt: null }, data: { revokedAt: new Date() } });
    await this.audit(adminId, AuditAction.UPDATE_ADMIN, 'Admin', id, ipAddress, { role: updated.role, isActive: updated.isActive });
    return updated;
  }

  async auditLogs(adminId: string, ipAddress?: string) {
    await this.audit(adminId, AuditAction.VIEW_AUDIT_LOG, 'AuditLog', undefined, ipAddress);
    return this.prisma.auditLog.findMany({ take: 200, orderBy: { createdAt: 'desc' }, include: { admin: { select: { displayName: true, email: true } } } });
  }

  private maskPhone(phone: string) { return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-****-$3'); }
}

