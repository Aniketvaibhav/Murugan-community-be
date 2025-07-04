import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      files?: Express.Multer.File[];
    }
  }
} 