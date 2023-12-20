import { bodyParser, contentType } from '@/main/middleware';
import cors from 'cors';
import { Express } from 'express';

export function setupMiddleware(app: Express): void {
  app.use(bodyParser);
  app.use(cors({ origin: '*' }));
  app.use(contentType);
}
