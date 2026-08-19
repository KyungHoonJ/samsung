import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationsService } from './consultations.service';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultations: ConsultationsService) {}

  @Post()
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  @ApiCreatedResponse({ description: '상담 신청 접수 완료' })
  create(@Body() dto: CreateConsultationDto) { return this.consultations.create(dto); }
}

