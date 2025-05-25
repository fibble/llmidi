# llmidi Technical Specification

## Project Overview
AI-powered MIDI composition application using conversational AI to generate musical parts through natural language. Built as an open-source Electron app with Vue.js frontend.

## Application Architecture

### Core Technology Stack
- **Framework**: Electron (for cross-platform desktop app)
- **Frontend**: Vue.js 3 with Composition API
- **State Management**: Pinia
- **Backend/Main Process**: Node.js
- **Package Manager**: npm/yarn
- **Build Tool**: Vite (recommended for Vue 3 + Electron)

### Key Dependencies

#### MIDI Processing
- `midi` or `node-midi` - MIDI I/O operations
- `rtmidi` - Real-time MIDI communication
- `midifile-ts` or `midi-parser-js` - MIDI file parsing/creation
- `@tonejs/midi` - Web Audio integration

#### Audio & Visualization
- `tone.js` - Built-in instrument playback and audio synthesis
- `d3.js` or `konva.js` - Piano roll visualization (custom components)
- Web Audio API - Browser audio context management

#### AI Integration
- `axios` or `fetch` - HTTP client for OpenRouter API calls
- OpenRouter API integration (no SDK needed, REST API)

#### Virtual MIDI (Platform-specific)
- Platform-specific virtual MIDI port creation
- OS-level MIDI routing capabilities

### Application Structure

```
src/
├── main/                 # Electron main process
│   ├── main.js          # Main Electron entry point
│   ├── midi-manager.js  # MIDI I/O and virtual port management
│   └── ipc-handlers.js  # IPC communication handlers
├── renderer/            # Vue.js frontend
│   ├── components/
│   │   ├── TrackPanel.vue      # Individual track with conversation
│   │   ├── PianoRoll.vue       # MIDI visualization component
│   │   ├── ChatInterface.vue   # Natural language input
│   │   ├── TransportControls.vue # Play/stop/loop controls
│   │   └── MixerControls.vue   # Solo/mute/volume per track
│   ├── stores/
│   │   ├── tracks.js           # Pinia store for track state
│   │   ├── midi.js             # MIDI data management
│   │   └── settings.js         # App configuration
│   ├── services/
│   │   ├── openrouter.js       # AI API integration
│   │   ├── midi-generator.js   # MIDI data generation from AI
│   │   └── audio-engine.js     # Tone.js audio management
│   └── utils/
│       ├── midi-utils.js       # MIDI data manipulation
│       └── prompt-engineering.js # AI prompt construction
```

## Core Features Implementation

### 1. Multi-Track Management
- **Track State**: Each track maintains:
  - Conversation history (array of user prompts + AI responses)
  - Generated MIDI data (notes, timing, velocity)
  - Audio settings (instrument, volume, mute, solo)
  - Generation parameters (bars, key, tempo, time signature)

### 2. Natural Language Processing
- **Prompt Engineering**: 
  - System prompts for consistent JSON MIDI output
  - Context injection (track settings, musical parameters)
  - Conversation history maintenance per track
- **AI Response Parsing**:
  - JSON validation and error handling
  - MIDI data extraction and conversion
  - Fallback mechanisms for malformed responses

### 3. MIDI Generation Flow
```
User Input → Prompt Engineering → OpenRouter API → JSON Response → MIDI Parsing → Track Update → UI Refresh
```

### 4. Audio Preview System
- **Built-in Instruments**: Tone.js samplers for quick preview
  - Piano, Electric Piano, Strings, Bass, Simple Drums
- **Virtual MIDI Routing**: OS-level virtual ports for DAW integration
- **Playback Engine**: Synchronized multi-track playback with visual feedback

### 5. Piano Roll Visualization
- **Canvas-based rendering** (60fps target)
- **Real-time updates** as MIDI generates
- **Playhead indicator** during playback
- **Responsive design** for different screen sizes

## Technical Requirements

### Performance Targets
- **Startup time**: < 3 seconds cold start
- **MIDI generation**: < 5 seconds from prompt to audio
- **UI responsiveness**: 60fps during playback
- **Memory usage**: < 200MB for typical session

### Platform Support
- **Windows 10+** (x64, ARM64)
- **macOS 10.15+** (Intel, Apple Silicon)
- **Linux** (Ubuntu 18.04+, AppImage distribution)

## Development Setup

### Environment Requirements
- **Node.js**: 18+ LTS
- **Git**: Latest version
- **Platform tools**:
  - Windows: Build Tools for Visual Studio
  - macOS: Xcode Command Line Tools
  - Linux: build-essential

### Development Scripts
```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac", 
    "build:linux": "electron-builder --linux",
    "lint": "eslint . --fix",
    "test": "vitest"
  }
}
```

## CI/CD Pipeline (GitHub Actions)

### Automated Workflows

#### 1. Development Workflow (`.github/workflows/dev.yml`)
```yaml
# Triggers: Push to main, PRs
# Steps:
# - Node.js setup (18.x)
# - Install dependencies
# - Run linting (ESLint)
# - Run tests (Vitest)
# - Build for development
```

#### 2. Release Workflow (`.github/workflows/release.yml`)
```yaml
# Triggers: Git tags (v*)
# Steps:
# - Multi-platform build matrix (Windows, macOS, Linux)
# - Code signing (future: certificates for distribution)
# - Generate installers (.exe, .dmg, .AppImage)
# - Create GitHub Release
# - Upload release artifacts
# - Update release notes
```

#### 3. Security Workflow (`.github/workflows/security.yml`)
```yaml
# Triggers: Weekly schedule, dependency updates
# Steps:
# - Dependency vulnerability scanning
# - License compliance checking
# - SAST (Static Application Security Testing)
```

### Release Strategy
- **Semantic Versioning**: vMAJOR.MINOR.PATCH
- **Release Channels**: 
  - Stable (main branch tags)
  - Beta (pre-release tags)
- **Auto-update**: Electron's built-in updater for future releases

## Configuration Management

### Environment Variables
```
OPENROUTER_API_KEY=<user-provided>
VITE_APP_VERSION=<from package.json>
NODE_ENV=development|production
```

### Settings Storage
- **Electron Store**: For persistent user settings
- **Settings Schema**:
  - OpenRouter API configuration
  - Default generation parameters
  - Audio device preferences
  - UI theme/layout preferences

## Security Considerations

### Electron Security
- **Context Isolation**: Enabled for renderer processes
- **Node Integration**: Disabled in renderer
- **Secure IPC**: Validated communication between main/renderer
- **CSP Headers**: Content Security Policy for web content

### API Security
- **API Key Management**: Secure storage, no logging
- **Rate Limiting**: Client-side throttling for API calls
- **Input Validation**: Sanitize all user inputs before AI processing

## Testing Strategy

### Unit Tests
- **Utils functions**: MIDI manipulation, prompt engineering
- **Services**: API integration, audio engine
- **Components**: Vue component logic

### Integration Tests
- **MIDI workflow**: End-to-end generation pipeline
- **Audio system**: Playback and routing functionality
- **File operations**: Export/import functionality

### Manual Testing
- **Cross-platform**: Test on all supported OS
- **DAW integration**: Test with major DAWs (Ableton, Logic, etc.)
- **Performance**: Memory usage, CPU usage during generation

## Documentation Requirements

### Developer Documentation
- **Setup guide**: Development environment setup
- **Architecture docs**: Code organization and patterns
- **API reference**: Internal API documentation
- **Contributing guide**: Code style, PR process

### User Documentation
- **Installation guide**: Platform-specific installation
- **User manual**: Feature documentation with examples
- **DAW integration**: Setup guides for popular DAWs
- **Troubleshooting**: Common issues and solutions

## Future Considerations

### Scalability
- **Plugin architecture**: For custom AI providers
- **Theme system**: UI customization capabilities
- **Localization**: Multi-language support

### Advanced Features
- **Collaborative editing**: Multi-user sessions
- **Cloud sync**: Settings and project synchronization
- **Advanced export**: Audio rendering, notation export
- **MIDI learn**: Hardware controller integration