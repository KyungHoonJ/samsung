import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto';

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;
  private readonly searchKey: string;

  constructor(config: ConfigService) {
    this.key = Buffer.from(config.getOrThrow<string>('FIELD_ENCRYPTION_KEY'), 'base64');
    this.searchKey = config.getOrThrow<string>('SEARCH_HASH_KEY');
    if (this.key.length !== 32) throw new InternalServerErrorException('FIELD_ENCRYPTION_KEY must be a 32-byte base64 value.');
  }

  encrypt(value: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join('.');
  }

  decrypt(payload: string) {
    const [iv, tag, encrypted] = payload.split('.').map(part => Buffer.from(part, 'base64'));
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }

  searchHash(value: string) { return createHmac('sha256', this.searchKey).update(value).digest('hex'); }
}

