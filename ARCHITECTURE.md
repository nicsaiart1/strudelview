# StrudelView Architecture Documentation

## Overview

StrudelView is a real-time, browser-based Strudel environment that provides a drag-and-drop heterarchical interface for creating and manipulating Strudel patterns. The architecture is designed for ultra-fast performance, multi-touch support, and seamless real-time collaboration.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                           │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │   React UI      │ │   Canvas/WebGL  │ │   Audio Engine  │ │
│ │   Components    │ │   Renderer      │ │   (Tone.js)     │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │              Strudel Engine Core                        │ │
│ │              (WebAssembly)                              │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                │ WebSocket (Optional)
                                │
┌─────────────────────────────────────────────────────────────┐
│                 Collaboration Server                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │   WebSocket     │ │   Session       │ │   Pattern       │ │
│ │   Handler       │ │   Manager       │ │   Storage       │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for ultra-fast development and builds
- **Styling**: TailwindCSS with custom components
- **State Management**: Zustand for lightweight, performant state management
- **Canvas Rendering**: WebGL with Three.js for high-performance graphics
- **Audio**: Tone.js integrated with Strudel engine
- **Drag & Drop**: React DnD with custom multi-touch extensions
- **Testing**: Vitest + React Testing Library

### Component Architecture

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Slider.tsx
│   │   ├── Dropdown.tsx
│   │   └── ThemeSelector.tsx
│   ├── canvas/                 # Canvas and rendering components
│   │   ├── CanvasContainer.tsx
│   │   ├── BlockRenderer.tsx
│   │   ├── ConnectionRenderer.tsx
│   │   └── TouchHandler.tsx
│   ├── blocks/                 # Block-related components
│   │   ├── BlockCard.tsx
│   │   ├── BlockPalette.tsx
│   │   ├── ParameterEditor.tsx
│   │   └── SemanticAtlas.tsx
│   ├── editor/                 # Code editor components
│   │   ├── CodeEditor.tsx
│   │   ├── SyncManager.tsx
│   │   └── LivePreview.tsx
│   └── workspace/              # Main workspace components
│       ├── WorkspaceContainer.tsx
│       ├── Toolbar.tsx
│       └── StatusBar.tsx
├── stores/                     # Zustand stores
│   ├── workspaceStore.ts
│   ├── audioStore.ts
│   ├── themeStore.ts
│   └── collaborationStore.ts
├── services/                   # Business logic services
│   ├── audioEngine.ts
│   ├── strudelBridge.ts
│   ├── collaborationService.ts
│   └── storageService.ts
├── types/                      # TypeScript type definitions
├── utils/                      # Utility functions
├── hooks/                      # Custom React hooks
└── themes/                     # Theme definitions
```

### State Management

**Zustand Stores:**

1. **WorkspaceStore**: Canvas state, blocks, connections, selections
2. **AudioStore**: Audio engine state, playback control, volume
3. **ThemeStore**: Active theme, color palettes, UI preferences
4. **CollaborationStore**: Session state, connected users, sync status

### Canvas Rendering System

**WebGL Rendering Pipeline:**
- **Scene Graph**: Hierarchical representation of blocks and connections
- **Batched Rendering**: Groups similar elements for optimal performance
- **Level of Detail**: Dynamic quality adjustment based on zoom level
- **Frustum Culling**: Only renders visible elements
- **Multi-touch Input**: Gesture recognition and touch event handling

### Real-time Audio Engine

**Audio Architecture:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Parameter     │    │   Strudel       │    │   Audio         │
│   Changes       │───▶│   Engine        │───▶│   Output        │
│                 │    │   (WASM)        │    │   (Tone.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Update     │    │   Code Gen      │    │   WebAudio      │
│   (React)       │    │   Sync          │    │   Context       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Backend Architecture (Optional Collaboration Server)

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with WebSocket support
- **Real-time**: Socket.io for WebSocket communication
- **Database**: Redis for session storage (optional PostgreSQL for persistence)
- **Authentication**: JWT tokens (optional)

### Server Components

```
src/
├── server.ts                   # Main server entry point
├── controllers/
│   ├── sessionController.ts    # Session management
│   ├── patternController.ts    # Pattern CRUD operations
│   └── collaborationController.ts
├── services/
│   ├── sessionService.ts       # Session business logic
│   ├── syncService.ts          # Real-time synchronization
│   └── storageService.ts       # Data persistence
├── middleware/
│   ├── authentication.ts      # JWT middleware
│   ├── rateLimit.ts           # Rate limiting
│   └── validation.ts          # Request validation
├── models/
│   ├── Session.ts             # Session data model
│   ├── Pattern.ts             # Pattern data model
│   └── User.ts                # User data model
└── utils/
    ├── logger.ts              # Logging utility
    └── config.ts              # Configuration management
```

### Real-time Collaboration

**Operational Transformation:**
- **Conflict Resolution**: CRDT-based approach for concurrent edits
- **Event Broadcasting**: Efficient delta synchronization
- **Session Management**: Room-based user organization
- **Presence Awareness**: Real-time cursor and selection sharing

## Data Models

### Block Schema

```typescript
interface Block {
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
  metadata: {
    version: string;
    author: string;
    documentation: string;
  };
}

interface Parameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select' | 'range';
  value: any;
  default: any;
  constraints?: {
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  };
  modulation?: ModulationSource;
}
```

### Project Schema

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  version: string;
  created: Date;
  modified: Date;
  canvas: {
    zoom: number;
    pan: { x: number; y: number };
    viewport: { width: number; height: number };
  };
  blocks: Block[];
  connections: Connection[];
  settings: ProjectSettings;
}

interface Connection {
  id: string;
  source: { blockId: string; outputId: string };
  target: { blockId: string; inputId: string };
  color?: string;
  weight?: number;
}
```

## Performance Optimizations

### Rendering Performance

1. **Canvas Optimization**:
   - Viewport culling for off-screen elements
   - Dynamic LOD based on zoom level
   - Batched draw calls for similar elements
   - Efficient dirty region tracking

2. **React Performance**:
   - Memoized components with React.memo
   - useMemo/useCallback for expensive computations
   - Virtual scrolling for large lists
   - Debounced parameter updates

3. **Audio Performance**:
   - WebAssembly for CPU-intensive operations
   - Audio worklet for low-latency processing
   - Efficient buffer management
   - Predictive audio scheduling

### Memory Management

- **Object Pooling**: Reuse canvas objects to minimize GC
- **Lazy Loading**: Load blocks and assets on-demand
- **Weak References**: Prevent memory leaks in event handlers
- **Resource Cleanup**: Proper cleanup of audio contexts and WebGL resources

## Security Considerations

### Client-Side Security

- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Proper escaping of dynamic content
- **CSRF Protection**: Token-based request validation
- **Content Security Policy**: Restrict resource loading

### Server-Side Security

- **Authentication**: JWT-based session management
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent abuse and DoS attacks
- **Data Validation**: Schema-based input validation

## Deployment Architecture

### Development Environment

```
┌─────────────────┐    ┌─────────────────┐
│   Vite Dev      │    │   Node.js       │
│   Server        │    │   Dev Server    │
│   (Port 3000)   │    │   (Port 3001)   │
└─────────────────┘    └─────────────────┘
         │                        │
         └────────────────────────┘
                    │
            ┌─────────────────┐
            │   Redis         │
            │   (Local)       │
            └─────────────────┘
```

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load          │    │   App           │
│   (Static)      │    │   Balancer      │    │   Servers       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                └────────────────────────┘
                                            │
                                ┌─────────────────┐
                                │   Redis         │
                                │   Cluster       │
                                └─────────────────┘
```

## API Design

### REST Endpoints

```
GET    /api/patterns              # List patterns
POST   /api/patterns              # Create pattern
GET    /api/patterns/:id          # Get pattern
PUT    /api/patterns/:id          # Update pattern
DELETE /api/patterns/:id          # Delete pattern

GET    /api/sessions              # List active sessions
POST   /api/sessions              # Create session
GET    /api/sessions/:id          # Join session
DELETE /api/sessions/:id          # Leave session

GET    /api/blocks                # Get block definitions
GET    /api/blocks/:category      # Get blocks by category
```

### WebSocket Events

```typescript
// Client to Server
interface ClientEvents {
  'join-session': { sessionId: string; userId: string };
  'leave-session': { sessionId: string };
  'block-update': { blockId: string; changes: Partial<Block> };
  'connection-create': { connection: Connection };
  'connection-delete': { connectionId: string };
  'cursor-move': { position: { x: number; y: number } };
}

// Server to Client
interface ServerEvents {
  'session-joined': { session: Session; users: User[] };
  'user-joined': { user: User };
  'user-left': { userId: string };
  'block-updated': { blockId: string; changes: Partial<Block>; userId: string };
  'connection-created': { connection: Connection; userId: string };
  'connection-deleted': { connectionId: string; userId: string };
  'cursor-updated': { userId: string; position: { x: number; y: number } };
}
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless Servers**: Session state stored in Redis
- **Load Balancing**: Round-robin with sticky sessions
- **Database Sharding**: Pattern data partitioned by user/project
- **CDN Integration**: Static assets served from edge locations

### Vertical Scaling

- **Resource Monitoring**: CPU, memory, and network usage tracking
- **Auto-scaling**: Dynamic server allocation based on load
- **Caching Strategy**: Multi-level caching (Redis, CDN, browser)
- **Database Optimization**: Indexing and query optimization

## Monitoring and Observability

### Metrics Collection

- **Performance Metrics**: Render time, audio latency, memory usage
- **User Metrics**: Session duration, feature usage, error rates
- **System Metrics**: Server response time, database performance
- **Business Metrics**: User engagement, pattern creation rates

### Logging Strategy

- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Log Levels**: DEBUG, INFO, WARN, ERROR with appropriate filtering
- **Centralized Logging**: Aggregation using ELK stack or similar
- **Error Tracking**: Integration with Sentry or similar service

### Health Checks

- **Endpoint Monitoring**: HTTP health check endpoints
- **Dependency Checks**: Database, Redis, external service health
- **Synthetic Monitoring**: Automated user journey testing
- **Alerting**: PagerDuty or similar for critical issues 