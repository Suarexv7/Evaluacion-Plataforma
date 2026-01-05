// src/common/types/request-user.type.ts
import type { Request } from 'express';

export type RequestUser = Request & { user: { id: number; role: string } };