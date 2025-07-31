# Getting Started with StrudelView

This guide will help you get StrudelView up and running on your local machine in just a few minutes.

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites Check

Make sure you have these installed:
```bash
node --version    # Should be 18.0+
npm --version     # Should be 9.0+
git --version     # Any recent version
```

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/nicsaiart1/strudelview.git
cd strudelview

# Install all dependencies (client + server)
npm run setup
```

### 3. Start Development

```bash
# Start both client and server in development mode
npm run dev
```

This will:
- Start the client at http://localhost:3000
- Start the server at http://localhost:3001
- Auto-reload on file changes

### 4. Open StrudelView

Open your browser to http://localhost:3000 and you should see the StrudelView interface!

## 🎵 First Pattern

Try creating your first pattern:

1. **Drag a Block**: From the Semantic Atlas, drag a "Pattern" block onto the canvas
2. **Set Parameters**: Click the block and modify its parameters
3. **Add Audio Output**: Drag an "Audio Out" block and connect it
4. **Press Play**: Hit the play button to hear your pattern

## 📁 Project Structure Overview

```
strudelview/
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── stores/       # State management
│   │   └── services/     # Business logic
│   └── package.json
├── server/               # Node.js backend (optional)
│   ├── src/
│   │   ├── controllers/  # API endpoints
│   │   └── services/     # Server logic
│   └── package.json
├── ARCHITECTURE.md       # Technical details
├── BUILD_GUIDE.md       # Comprehensive build instructions
└── README.md            # Project overview
```

## 🛠️ Development Workflow

### Running Individual Components

```bash
# Client only
npm run dev:client

# Server only  
npm run dev:server
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run client tests only
npm run test:client
```

### Code Quality

```bash
# Check TypeScript types
npm run type-check

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Building

```bash
# Build everything for production
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server
```

## 🎨 Customization

### Adding New Blocks

1. Create block definition in `client/src/types/blocks/`
2. Add component in `client/src/components/blocks/`
3. Register in block registry
4. Add to Semantic Atlas categories

### Modifying Themes

Themes are defined in `client/src/themes/`. Each theme includes:
- Color palettes
- Connection styles
- UI styling
- Gradient definitions

### Audio Engine Integration

The audio engine lives in `client/src/services/audioEngine.ts`. Modify this to:
- Add new audio effects
- Change synthesis methods
- Integrate with different audio libraries

## 🐛 Troubleshooting

### Common Issues

**Audio not working?**
- Check browser audio permissions
- Ensure no other audio applications are blocking
- Try refreshing the page

**Blocks not appearing?**
- Check browser console for errors
- Verify all dependencies are installed
- Try `npm run clean` and reinstall

**Performance issues?**
- Reduce canvas zoom level
- Close unused browser tabs
- Check browser's performance tab

**Development server won't start?**
- Check if ports 3000/3001 are available
- Try `npm run clean` and `npm run setup`
- Verify Node.js version compatibility

### Getting Help

1. **Check the Issues**: Look at [GitHub Issues](https://github.com/nicsaiart1/strudelview/issues)
2. **Documentation**: Read the full [Architecture Guide](ARCHITECTURE.md) and [Build Guide](BUILD_GUIDE.md)
3. **Community**: Join our [Discord](https://discord.gg/strudelview) for real-time help
4. **Create an Issue**: If you find a bug, please create a detailed issue report

## 🎯 Next Steps

Now that you have StrudelView running:

1. **Explore the Interface**: Try different blocks and connections
2. **Read the Documentation**: Deep dive into [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Join the Community**: Connect with other developers and musicians
4. **Contribute**: Check out [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
5. **Build Something Cool**: Create and share your patterns!

## 📚 Learning Resources

- **Strudel Documentation**: Learn the underlying language
- **Web Audio API**: Understand browser audio capabilities  
- **React Three Fiber**: For 3D rendering concepts
- **Tone.js**: For audio synthesis and effects

## 🎉 You're Ready!

You now have a fully functional StrudelView development environment. Start creating, experimenting, and building amazing musical experiences!

---

**Need help?** Don't hesitate to reach out on [Discord](https://discord.gg/strudelview) or create an [issue](https://github.com/nicsaiart1/strudelview/issues). 