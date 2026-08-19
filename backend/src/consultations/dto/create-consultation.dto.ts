import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsIn, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, MaxLength } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ enum: ConsultationCategory }) @IsEnum(ConsultationCategory) category: ConsultationCategory;
  @ApiProperty() @IsString() @Length(2, 30) name: string;
  @ApiProperty() @IsPhoneNumber('KR') phone: string;
  @ApiProperty() @IsString() @Length(2, 50) regionLevel1: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) regionLevel2?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) preferredPlace?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) preferredContactTime?: string;
  @ApiProperty() @IsString() @Length(20, 1000) inquiry: string;
  @ApiProperty() @IsBoolean() @IsIn([true]) privacyConsent: true;
  @ApiProperty() @IsString() @IsNotEmpty() @MaxLength(30) privacyConsentVersion: string;
}

