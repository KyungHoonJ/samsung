import { AdminRole, ConsultationCategory, ConsultationStatus, ContactType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min, MinLength } from 'class-validator';

export class ConsultationQueryDto {
  @IsOptional() @IsEnum(ConsultationStatus) status?: ConsultationStatus;
  @IsOptional() @IsEnum(ConsultationCategory) category?: ConsultationCategory;
  @IsOptional() @IsString() @MaxLength(100) search?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}

export class UpdateStatusDto { @IsEnum(ConsultationStatus) status: ConsultationStatus; }
export class CreateNoteDto { @IsString() @Length(1, 2000) content: string; }
export class CreateContactDto {
  @IsEnum(ContactType) type: ContactType;
  @IsOptional() @IsString() @MaxLength(500) result?: string;
  @IsDateString() contactedAt: string;
}

export class CreateAdminDto {
  @IsEmail() email: string;
  @IsString() @Length(2, 50) displayName: string;
  @IsString() @MinLength(10) @MaxLength(100) password: string;
  @IsEnum(AdminRole) role: AdminRole;
}

export class UpdateAdminDto {
  @IsOptional() @IsString() @Length(2, 50) displayName?: string;
  @IsOptional() @IsEnum(AdminRole) role?: AdminRole;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() @MinLength(10) @MaxLength(100) password?: string;
}

