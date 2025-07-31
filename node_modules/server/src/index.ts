import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.get('/api/projects', (req, res) => {
  res.json({ projects: [] });
});

app.post('/api/projects', (req, res) => {
  const { name, description } = req.body;
  // TODO: Implement project creation
  res.json({ 
    id: crypto.randomUUID(),
    name,
    description,
    created: new Date().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-project', (projectId: string) => {
    socket.join(projectId);
    console.log(`Client ${socket.id} joined project ${projectId}`);
  });

  socket.on('leave-project', (projectId: string) => {
    socket.leave(projectId);
    console.log(`Client ${socket.id} left project ${projectId}`);
  });

  socket.on('project-update', (data) => {
    // Broadcast project updates to all clients in the same project
    socket.to(data.projectId).emit('project-updated', data);
  });

  socket.on('block-created', (data) => {
    socket.to(data.projectId).emit('block-created', data);
  });

  socket.on('block-updated', (data) => {
    socket.to(data.projectId).emit('block-updated', data);
  });

  socket.on('block-deleted', (data) => {
    socket.to(data.projectId).emit('block-deleted', data);
  });

  socket.on('connection-created', (data) => {
    socket.to(data.projectId).emit('connection-created', data);
  });

  socket.on('connection-deleted', (data) => {
    socket.to(data.projectId).emit('connection-deleted', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 StrudelView server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;