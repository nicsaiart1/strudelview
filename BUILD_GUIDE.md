# StrudelView Build Guide

## Prerequisites

### System Requirements

- **Node.js**: v18.0+ (recommended: v20.0+)
- **npm**: v9.0+ or **yarn**: v3.0+
- **Git**: Latest version
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Development Tools

- **Code Editor**: VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
- **Browser Extensions**: React Developer Tools, Redux DevTools

## Phase 1: Project Initialization

### Step 1: Create Project Structure

```bash
# Create main project directory
mkdir strudelview
cd strudelview

# Initialize as Git repository
git init
```

### Step 2: Initialize Frontend Application

```bash
# Create Vite + React + TypeScript application
npm create vite@latest client -- --template react-ts
cd client

# Install dependencies
npm install

# Install additional required packages
npm install \
  zustand \
  @react-three/fiber \
  @react-three/drei \
  three \
  tone \
  react-dnd \
  react-dnd-html5-backend \
  react-dnd-touch-backend \
  react-dnd-multi-backend \
  @monaco-editor/react \
  tailwindcss \
  @tailwindcss/forms \
  @headlessui/react \
  @heroicons/react \
  framer-motion \
  uuid \
  lodash \
  classnames

# Install development dependencies
npm install -D \
  @types/three \
  @types/uuid \
  @types/lodash \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  autoprefixer \
  postcss \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh
```

### Step 3: Configure Build Tools

#### 3.1 Configure Tailwind CSS

```bash
# Initialize Tailwind CSS
npx tailwindcss init -p
```

Create/update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        canvas: {
          bg: '#0f172a',
          grid: '#1e293b',
          highlight: '#3b82f6',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

#### 3.2 Configure Vite

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@stores': resolve(__dirname, './src/stores'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@themes': resolve(__dirname, './src/themes'),
    },
  },
  optimizeDeps: {
    include: ['three', 'tone'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          tone: ['tone'],
          react: ['react', 'react-dom'],
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
})
```

#### 3.3 Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@components/*": ["components/*"],
      "@stores/*": ["stores/*"],
      "@services/*": ["services/*"],
      "@types/*": ["types/*"],
      "@utils/*": ["utils/*"],
      "@hooks/*": ["hooks/*"],
      "@themes/*": ["themes/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Phase 2: Core Infrastructure Setup

### Step 4: Create Project Structure

```bash
# Navigate to client/src and create directory structure
cd src
mkdir -p \
  components/{ui,canvas,blocks,editor,workspace} \
  stores \
  services \
  types \
  utils \
  hooks \
  themes \
  test \
  assets/{icons,themes,audio}
```

### Step 5: Type Definitions

Create `src/types/index.ts`:

```typescript
// Core data types
export interface Block {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string[];
  tags: string[];
  position: { x: number; y: number };
  parameters: Parameter[];
  inputs: ConnectionPoint[];
  outputs: ConnectionPoint[];
  metadata: BlockMetadata;
}

export interface Parameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select' | 'range';
  value: any;
  default: any;
  constraints?: ParameterConstraints;
  modulation?: ModulationSource;
}

export interface Connection {
  id: string;
  source: { blockId: string; outputId: string };
  target: { blockId: string; inputId: string };
  color?: string;
  weight?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  version: string;
  created: Date;
  modified: Date;
  canvas: CanvasState;
  blocks: Block[];
  connections: Connection[];
  settings: ProjectSettings;
}

// ... (additional type definitions)
```

### Step 6: Zustand Stores

Create `src/stores/workspaceStore.ts`:

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Block, Connection, Project } from '@types';

interface WorkspaceState {
  // State
  currentProject: Project | null;
  selectedBlocks: string[];
  selectedConnections: string[];
  canvas: {
    zoom: number;
    pan: { x: number; y: number };
    viewport: { width: number; height: number };
  };
  
  // Actions
  createBlock: (type: string, position: { x: number; y: number }) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  createConnection: (source: ConnectionPoint, target: ConnectionPoint) => void;
  deleteConnection: (id: string) => void;
  selectBlocks: (ids: string[]) => void;
  updateCanvas: (updates: Partial<typeof canvas>) => void;
  loadProject: (project: Project) => void;
  saveProject: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProject: null,
      selectedBlocks: [],
      selectedConnections: [],
      canvas: {
        zoom: 1,
        pan: { x: 0, y: 0 },
        viewport: { width: 1920, height: 1080 }
      },

      // Actions
      createBlock: (type, position) => {
        // Implementation
      },
      
      updateBlock: (id, updates) => {
        // Implementation
      },
      
      // ... (other actions)
    }),
    { name: 'workspace-store' }
  )
);
```

### Step 7: Core Services

Create `src/services/audioEngine.ts`:

```typescript
import * as Tone from 'tone';

export class AudioEngine {
  private static instance: AudioEngine;
  private context: AudioContext;
  private isInitialized = false;

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await Tone.start();
    this.context = Tone.context.rawContext;
    this.isInitialized = true;
  }

  async play(pattern: string): Promise<void> {
    // Implement Strudel pattern playback
  }

  stop(): void {
    Tone.Transport.stop();
  }

  setVolume(volume: number): void {
    Tone.Destination.volume.value = volume;
  }
}
```

## Phase 3: UI Components Development

### Step 8: Base UI Components

Create `src/components/ui/Button.tsx`:

```typescript
import React from 'react';
import { classNames } from '@utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'px-3 py-2 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        },
        {
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
```

### Step 9: Canvas Components

Create `src/components/canvas/CanvasContainer.tsx`:

```typescript
import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWorkspaceStore } from '@stores/workspaceStore';
import { BlockRenderer } from './BlockRenderer';
import { ConnectionRenderer } from './ConnectionRenderer';
import { TouchHandler } from './TouchHandler';

export const CanvasContainer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentProject, canvas, updateCanvas } = useWorkspaceStore();

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current.parentElement!;
        updateCanvas({
          viewport: { width: clientWidth, height: clientHeight }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvas]);

  return (
    <div className="relative w-full h-full bg-canvas-bg overflow-hidden">
      <Canvas
        ref={canvasRef}
        camera={{
          position: [canvas.pan.x, canvas.pan.y, 10],
          zoom: canvas.zoom,
          orthographic: true,
        }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />

        {/* Render blocks */}
        {currentProject?.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}

        {/* Render connections */}
        {currentProject?.connections.map((connection) => (
          <ConnectionRenderer key={connection.id} connection={connection} />
        ))}
      </Canvas>

      {/* Touch and interaction handlers */}
      <TouchHandler />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          transform: `scale(${canvas.zoom}) translate(${canvas.pan.x}px, ${canvas.pan.y}px)`,
        }}
      />
    </div>
  );
};
```

## Phase 4: Block System Implementation

### Step 10: Block Components

Create `src/components/blocks/BlockCard.tsx`:

```typescript
import React from 'react';
import { useDrag } from 'react-dnd';
import { Block } from '@types';
import { ParameterEditor } from './ParameterEditor';
import { useWorkspaceStore } from '@stores/workspaceStore';

interface BlockCardProps {
  block: Block;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  isSelected = false,
  onSelect,
}) => {
  const { updateBlock } = useWorkspaceStore();

  const [{ isDragging }, drag] = useDrag({
    type: 'BLOCK',
    item: { id: block.id, type: block.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleParameterChange = (parameterId: string, value: any) => {
    const updatedParameters = block.parameters.map(param =>
      param.id === parameterId ? { ...param, value } : param
    );
    updateBlock(block.id, { parameters: updatedParameters });
  };

  return (
    <div
      ref={drag}
      className={`
        bg-white rounded-lg shadow-md border-2 transition-all duration-200 cursor-move
        ${isSelected ? 'border-primary-500 shadow-lg' : 'border-gray-200'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:shadow-lg hover:border-primary-300
      `}
      onClick={() => onSelect?.(block.id)}
      style={{
        transform: `translate(${block.position.x}px, ${block.position.y}px)`,
        width: '240px',
        minHeight: '120px',
      }}
    >
      {/* Block Header */}
      <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-lg">
        <h3 className="font-semibold text-sm">{block.name}</h3>
        <p className="text-xs opacity-90">{block.type}</p>
      </div>

      {/* Block Body */}
      <div className="p-3">
        <p className="text-xs text-gray-600 mb-3">{block.description}</p>
        
        {/* Parameters */}
        <div className="space-y-2">
          {block.parameters.map((parameter) => (
            <ParameterEditor
              key={parameter.id}
              parameter={parameter}
              onChange={(value) => handleParameterChange(parameter.id, value)}
            />
          ))}
        </div>
      </div>

      {/* Connection Points */}
      <div className="flex justify-between p-2 bg-gray-50 rounded-b-lg">
        <div className="flex space-x-1">
          {block.inputs.map((input) => (
            <div
              key={input.id}
              className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"
              title={input.name}
            />
          ))}
        </div>
        <div className="flex space-x-1">
          {block.outputs.map((output) => (
            <div
              key={output.id}
              className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-sm"
              title={output.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### Step 11: Parameter Editor

Create `src/components/blocks/ParameterEditor.tsx`:

```typescript
import React from 'react';
import { Parameter } from '@types';

interface ParameterEditorProps {
  parameter: Parameter;
  onChange: (value: any) => void;
}

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameter,
  onChange,
}) => {
  const renderInput = () => {
    switch (parameter.type) {
      case 'number':
        return (
          <input
            type="number"
            value={parameter.value}
            min={parameter.constraints?.min}
            max={parameter.constraints?.max}
            step={parameter.constraints?.step || 0.1}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        );
      
      case 'range':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              value={parameter.value}
              min={parameter.constraints?.min || 0}
              max={parameter.constraints?.max || 100}
              step={parameter.constraints?.step || 1}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 w-8">{parameter.value}</span>
          </div>
        );
      
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={parameter.value}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        );
      
      case 'select':
        return (
          <select
            value={parameter.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {parameter.constraints?.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'string':
      default:
        return (
          <input
            type="text"
            value={parameter.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        );
    }
  };

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-gray-700 w-1/3">
        {parameter.name}
      </label>
      <div className="w-2/3">
        {renderInput()}
      </div>
    </div>
  );
};
```

## Phase 5: Testing Setup

### Step 12: Test Configuration

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    createGain: vi.fn(),
    createOscillator: vi.fn(),
    createAnalyser: vi.fn(),
    createBuffer: vi.fn(),
    createBufferSource: vi.fn(),
    destination: {},
    resume: vi.fn(),
    suspend: vi.fn(),
    close: vi.fn(),
  })),
});

// Mock WebGL context
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextType) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      createProgram: vi.fn(),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      useProgram: vi.fn(),
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      vertexAttribPointer: vi.fn(),
      clear: vi.fn(),
      clearColor: vi.fn(),
      drawArrays: vi.fn(),
      getAttribLocation: vi.fn(),
      getUniformLocation: vi.fn(),
      uniform1f: vi.fn(),
      uniformMatrix4fv: vi.fn(),
    };
  }
  return null;
});
```

### Step 13: Sample Tests

Create `src/components/ui/Button.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('opacity-50');
  });

  it('applies variant styles', () => {
    render(<Button variant="danger">Delete</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });
});
```

## Phase 6: Build Scripts and Development

### Step 14: Package.json Scripts

Update `package.json` with scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\""
  }
}
```

### Step 15: Development Workflow

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## Phase 7: Backend Server Setup (Optional)

### Step 16: Initialize Backend

```bash
# Navigate back to project root
cd ..

# Create server directory
mkdir server
cd server

# Initialize Node.js project
npm init -y

# Install dependencies
npm install \
  express \
  socket.io \
  cors \
  helmet \
  dotenv \
  jsonwebtoken \
  bcryptjs \
  redis \
  pg \
  joi \
  winston

# Install development dependencies
npm install -D \
  @types/node \
  @types/express \
  @types/cors \
  @types/jsonwebtoken \
  @types/bcryptjs \
  typescript \
  ts-node \
  nodemon \
  jest \
  @types/jest \
  supertest \
  @types/supertest
```

### Step 17: Server Configuration

Create `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Create `server/src/server.ts`:

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-session', (data) => {
    socket.join(data.sessionId);
    socket.to(data.sessionId).emit('user-joined', { userId: socket.id });
  });

  socket.on('block-update', (data) => {
    socket.to(data.sessionId).emit('block-updated', {
      ...data,
      userId: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Phase 8: Production Build & Deployment

### Step 18: Production Build

```bash
# Build client
cd client
npm run build

# Build server (if using)
cd ../server
npm run build
```

### Step 19: Docker Configuration

Create `Dockerfile` in project root:

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

# Build client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production

COPY client/ .
RUN npm run build

# Build server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ .
RUN npm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Copy built client
COPY --from=builder /app/client/dist ./client/dist

# Copy built server
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/

EXPOSE 3001

CMD ["node", "server/dist/server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./client/dist:/usr/share/nginx/html:ro
    depends_on:
      - app
```

### Step 20: Deployment Scripts

Create `scripts/deploy.sh`:

```bash
#!/bin/bash

echo "Building StrudelView for production..."

# Build client
cd client
npm ci
npm run build
cd ..

# Build server
cd server
npm ci
npm run build
cd ..

# Build Docker image
docker-compose build

echo "Deployment ready!"
echo "Run 'docker-compose up -d' to start the application"
```

## Phase 9: Monitoring & Maintenance

### Step 21: Health Checks

Create `server/src/routes/health.ts`:

```typescript
import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

router.get('/ready', (req, res) => {
  // Check dependencies (database, redis, etc.)
  res.json({ status: 'ready' });
});

export default router;
```

### Step 22: Logging Configuration

Create `server/src/utils/logger.ts`:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'strudelview-server' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## Summary

This comprehensive build guide provides:

1. **Complete project setup** with modern tooling (Vite, TypeScript, Tailwind)
2. **Modular architecture** with clear separation of concerns
3. **Performance optimizations** for real-time audio and canvas rendering
4. **Testing framework** for reliable development
5. **Production deployment** with Docker and health monitoring
6. **Scalable backend** for collaboration features

**Next Steps:**
1. Follow this guide to build the MVP
2. Implement additional block types and Strudel integration
3. Add theme system and multi-touch gestures
4. Set up real-time collaboration features
5. Deploy to production environment

The architecture supports all the ambitious goals outlined in the project overview while maintaining clean, maintainable code that can scale as features are added. 