import { Module } from '@nestjs/common';
import { EncryptionService } from '../encryption/encryption.service';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';

@Module({ controllers: [ConsultationsController], providers: [ConsultationsService, EncryptionService] })
export class ConsultationsModule {}

