import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app: Application = express();

  // Middleware
  const clientUrlEnv = process.env.CLIENT_URL;
  const allowedOrigins = clientUrlEnv
    ? (clientUrlEnv.includes(',') ? clientUrlEnv.split(',').map(u => u.trim()) : clientUrlEnv)
    : 'http://localhost:5173';

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      service: 'AarogyaBharat Medical Tourism API',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API Routes
  app.use('/api', routes);

  // 404 Handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
