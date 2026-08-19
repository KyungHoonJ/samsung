import { AdminRole } from '@prisma/client';
import { Request } from 'express';

export type SessionAdmin = { id: string; email: string; displayName: string; role: AdminRole };
export interface AuthenticatedRequest extends Request { admin: SessionAdmin; sessionId: string }

