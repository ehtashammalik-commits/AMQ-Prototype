# QM Transcription App - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm installed

### Installation & Running

```bash
# Navigate to project directory
cd "d:\DeepLearningAI\QM Module Mockup"

# Install dependencies
npm install

# Start development server
npm start

# App opens at http://localhost:4200
```

### Available Scripts
```bash
npm start          # Development server (ng serve)
npm run build      # Production build
npm run build:prod # Production build with optimizations
npm run watch      # Watch mode for development
```

## Current Phase
**Phase 1: Setup & Core Structure** ✓ COMPLETE

### What's Working Now
- Angular 18 application
- Sidebar with navigation
- Header with date/user info
- File upload with drag-and-drop
- Audio file validation
- Conversation view with message bubbles
- LocalStorage persistence

### Ready to Test
1. Run `npm install`
2. Run `npm start`
3. Upload an audio file (drag-drop or click button)
4. See file appear in conversation

## Project Structure
- `src/app/components/` - UI Components
- `src/app/services/` - Business logic & API calls
- `src/app/models/` - TypeScript interfaces
- `src/styles.scss` - Global styling (ExpertFlow colors)

## Next: Phase 2
Coming soon:
- Audio playback controls
- OpenAI Whisper transcription
- Transcription display in chat

---
See `PHASE1_README.md` for detailed information.
