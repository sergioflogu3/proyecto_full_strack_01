import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import healthRouter from './routes/health';
import usersRoute from './routes/users';
import projectsRoute from './routes/projects';
import tasksRoute from './routes/tasks';
import authRoute from './routes/auth';
import commentsRoute from './routes/comments';
import { swaggerSpec } from './config/swagger';
import { createAuthMiddleware } from './middleware/auth.middleware';
import { success, error } from './utils/api-response';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL, // ← se toma de Railway
].filter(Boolean) as string[];


// ── Middlewares globales ──────────────────────────
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Documentación Swagger ────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth global para /api (excluye POST /auth/register y POST /auth/login)
const authMw = createAuthMiddleware();
app.use('/api', authMw);

// ── Rutas ────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRoute); 
app.use('/api/tasks', tasksRoute); 
app.use('/api/auth', authRoute);
app.use('/api/comments', commentsRoute);


// Ruta raíz informativa
app.get('/', (req: Request, res: Response) => {
  success(res, {
    version: '1.0.0',
    docs: '/api-docs',
  }, 'TaskFlow API');
});

// ── Middleware de errores no encontrados ─────────
app.use((req: Request, res: Response) => {
  error(res, 'Ruta no encontrada', 404);
});

// ── Iniciar servidor ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

export default app;
