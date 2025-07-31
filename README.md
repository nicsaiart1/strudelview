# StrudelView

> **See, shape, and flow through every beat of Strudel in real time.**

StrudelView is a real-time, ultra-fast, browser-based Strudel environment that exposes all of Strudel's functionality with a drag-and-drop heterarchical interface, enabling both beginners and advanced users to explore, create, and control Strudel patterns effortlessly on desktop or touch devices.

![StrudelView Interface](./docs/images/strudelview-hero.png)

## ✨ Features

### 🎵 Real-time Audio Engine
- **Ultra-low latency**: ≤10ms from edit to audible change
- **WebAssembly powered**: CPU-intensive operations optimized for performance
- **Tone.js integration**: Professional-grade Web Audio API implementation
- **Live preview**: Changes instantly audible and visible

### 🎨 Visual Block Interface
- **Drag-and-drop blocks**: Intuitive visual programming interface
- **Semantic Atlas**: Browse blocks by Time, Pitch, Pattern Generators, Logic, Effects, Utilities
- **Multi-tag indexing**: Blocks appear in multiple relevant contexts
- **Connection system**: Visual flow between pattern generators, transformations, and outputs

### 📱 Multi-touch Support
- **Touch-first design**: Optimized for tablets and touchscreen devices
- **Gesture recognition**: Pinch-to-zoom, two-finger panning, lasso selection
- **Responsive canvas**: Smooth, low-latency interaction on all devices
- **Adaptive UI**: Automatically adjusts for screen size and input method

### 🎭 Custom Themes
- **10 unique presets**: Artfully designed color palettes
- **Tri-gradient connections**: Contrasting thin line palettes for visual clarity
- **Dark/Light modes**: High contrast options for accessibility
- **Visual inspiration**: Themes designed to enhance creative workflow

### 👥 Real-time Collaboration
- **Multi-user sessions**: Shared pattern editing with conflict resolution
- **Presence awareness**: Real-time cursor and selection sharing
- **Operational transformation**: CRDT-based approach for concurrent edits
- **Session management**: Room-based user organization

### ⚡ Performance Optimized
- **60fps rendering**: Smooth drag-drop and visual feedback
- **Viewport culling**: Only renders visible elements
- **Batched operations**: Optimized WebGL rendering pipeline
- **Memory efficient**: Object pooling and smart garbage collection

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0+
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### Installation

```bash
# Clone the repository
git clone https://github.com/nicsaiart1/strudelview.git
cd strudelview

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view StrudelView in your browser.

### First Steps

1. **Start with Templates**: Choose from preset patterns or start with a blank canvas
2. **Drag Blocks**: Browse the Semantic Atlas and drag blocks onto the canvas
3. **Connect & Play**: Drag connections between blocks and hit Play for instant feedback
4. **Tweak Parameters**: Use real-time parameter editing with immediate audio preview
5. **Switch Views**: Toggle between visual blocks and raw Strudel code
6. **Choose Your Theme**: Pick from 10 tri-gradient presets to suit your mood

## 📋 Documentation

- **[Architecture Guide](ARCHITECTURE.md)** - Detailed technical architecture and design decisions
- **[Build Guide](BUILD_GUIDE.md)** - Step-by-step instructions for building StrudelView
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Block Development](docs/BLOCKS.md)** - Creating custom blocks and extensions
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🏗️ Architecture Overview

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

### Technology Stack

**Frontend:**
- React 18 + TypeScript for component architecture
- Vite for ultra-fast development and builds
- TailwindCSS for responsive styling
- Zustand for lightweight state management
- Three.js + WebGL for high-performance canvas rendering
- Tone.js for professional audio processing

**Backend (Optional):**
- Node.js + Express for RESTful API
- Socket.io for real-time WebSocket communication
- Redis for session storage and caching
- PostgreSQL for persistent data storage

## 🛠️ Development

### Scripts

```bash
# Development
npm run dev          # Start development server
npm run test         # Run tests in watch mode
npm run type-check   # TypeScript type checking

# Building
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint checking
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
```

### Project Structure

```
strudelview/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── canvas/        # Canvas and rendering
│   │   │   ├── blocks/        # Block-related components
│   │   │   ├── editor/        # Code editor components
│   │   │   └── workspace/     # Main workspace
│   │   ├── stores/           # Zustand state stores
│   │   ├── services/         # Business logic services
│   │   ├── types/            # TypeScript definitions
│   │   ├── utils/            # Utility functions
│   │   ├── hooks/            # Custom React hooks
│   │   └── themes/           # Theme definitions
│   ├── public/               # Static assets
│   └── package.json
├── server/                   # Backend server (optional)
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Data models
│   │   └── utils/            # Server utilities
│   └── package.json
├── docs/                     # Documentation
├── ARCHITECTURE.md           # Technical architecture
├── BUILD_GUIDE.md           # Build instructions
└── README.md                # This file
```

## 🧪 Testing

StrudelView uses Vitest and React Testing Library for comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t strudelview .
docker run -p 3000:3000 strudelview
```

### Environment Variables

```bash
# Client
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001

# Server
PORT=3001
CLIENT_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/strudelview
JWT_SECRET=your-secret-key
```

## 🗺️ Roadmap

### MVP (Phase 1) - Current
- [x] Core block system with drag-and-drop interface
- [x] Real-time audio engine integration
- [x] Touch-enabled canvas with multi-gesture support
- [x] Basic theme system with 10 presets
- [ ] Essential Strudel blocks (Pattern, Time, Pitch, Effects)

### Phase 2 - Collaboration
- [ ] Real-time multi-user editing
- [ ] Pattern library and sharing
- [ ] Advanced block set with modulation
- [ ] Export capabilities (MIDI, OSC, JSON)

### Phase 3 - Intelligence
- [ ] AI-assisted pattern recommendations
- [ ] Advanced visualization (waveforms, animations)
- [ ] Plugin system for custom blocks
- [ ] Performance analytics and optimization

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Strudel Community** - For the amazing live coding language that inspired this project
- **Tone.js Team** - For the robust Web Audio framework
- **React Three Fiber** - For making 3D rendering in React accessible
- **Contributors** - Everyone who has contributed to making StrudelView better

## 📧 Contact

- **Project Lead**: [Your Name](mailto:your.email@example.com)
- **Discord**: [StrudelView Community](https://discord.gg/strudelview)
- **Twitter**: [@StrudelView](https://twitter.com/strudelview)

---

**StrudelView** - Bringing the power of Strudel to everyone through intuitive visual programming. 🎵✨ 