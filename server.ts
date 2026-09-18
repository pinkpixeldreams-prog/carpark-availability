import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import healthHandler from './api/health';
import carparkAvailabilityHandler from './api/carparkavailability';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes at root level /api
  app.all('/api/health', (req, res) => {
    healthHandler(req, res);
  });

  app.all('/api/carparkavailability', (req, res) => {
    carparkAvailabilityHandler(req, res);
  });

  // Also support alias /api/carpark-availability for convenience
  app.all('/api/carpark-availability', (req, res) => {
    carparkAvailabilityHandler(req, res);
  });

  // Vite middleware in development, static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
