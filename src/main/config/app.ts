import { setupMiddleware } from '@/main/config/setup-middleware';
import { setupRoutes } from '@/main/config/setup-routes';
import express from 'express';

const app = express();
setupMiddleware(app);
setupRoutes(app);

export default app;
