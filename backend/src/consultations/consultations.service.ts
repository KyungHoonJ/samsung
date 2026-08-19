import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomInt } from 'node:crypto';
import { EncryptionService } from '../encryption/encryption.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class ConsultationsService {
  private readonly logger = new Logger(ConsultationsService.name);
  constructor(private readonly prisma: PrismaService, private readonly encryption: EncryptionService, private readonly config: ConfigService) {}

  async create(dto: CreateConsultationDto) {
    const now = new Date();
    const retentionDays = Number(this.config.get('CONSULTATION_RETENTION_DAYS', 180));
    const retentionExpiresAt = new Date(now.getTime() + retentionDays * 86_400_000);
    const phone = dto.phone.replace(/\D/g, '');
    const publicId = `C-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${randomInt(100000, 999999)}`;

    const consultation = await this.prisma.consultation.create({ data: {
      publicId, category: dto.category,
      nameEncrypted: this.encryption.encrypt(dto.name.trim()),
      phoneEncrypted: this.encryption.encrypt(phone),
      phoneSearchHash: this.encryption.searchHash(phone),
      regionLevel1: dto.regionLevel1,
      regionLevel2: dto.regionLevel2 || null,
      preferredPlace: dto.preferredPlace || null,
      preferredContactTime: dto.preferredContactTime || null,
      inquiryEncrypted: this.encryption.encrypt(dto.inquiry.trim()),
      privacyConsentVersion: dto.privacyConsentVersion,
      privacyConsentAt: now,
      retentionExpiresAt,
    }, select: { publicId: true } });

    return { publicId: consultation.publicId, status: 'RECEIVED', message: '상담 신청이 접수되었습니다.' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'Asia/Seoul' })
  async purgeExpired() {
    const result = await this.prisma.consultation.deleteMany({ where: { retentionExpiresAt: { lte: new Date() } } });
    this.logger.log(`Expired consultations purged: ${result.count}`);
  }
}

