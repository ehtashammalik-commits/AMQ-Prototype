# Phase 2: Audio & Transcription with ElevenLabs ASR - Complete ✓

## What's Working Now

### ✅ Audio Playback
- Play/pause button with visual feedback
- Progress bar showing current time
- Time display (current / total duration)
- Auto-reset when audio ends
- **Highlight on Play** - Transcription segments highlight as audio plays in real-time

### ✅ ElevenLabs ASR with Native Speaker Diarization
- **Provider**: ElevenLabs (best diarization quality for Arabic)
- Model: `scribe_v2` (latest STT model with diarization support)
- Transcription button for each audio file
- Arabic language support (configured for 'ar')
- **Native Speaker Diarization** - Built-in speaker identification via `identify_speakers`
- Automatic speaker mapping (speaker_0 → Customer, speaker_1 → Agent)
- Conversation displayed as dialogue between two speakers
- Transcription results displayed with proper chat bubbles
- Timestamps and confidence scores for each segment
- Loading state while transcribing
- Multi-provider support (ElevenLabs primary, OpenAI fallback)

### ✅ Single Audio Selection
- **Audio File List**: Click any uploaded audio to select it
- **Active Indicator**: Selected audio highlighted in blue
- **Status Badges**: 
  - ⏳ Shows when transcription is in progress
  - ✓ Shows when transcription is complete
- **One at a Time**: Only selected audio's transcription displays
- **Easy Navigation**: Switch between multiple uploaded files instantly

### ✅ Speaker Identification & Chat Display
- **Left side**: Customer/Caller (gray bubbles #e8e8e8)
- **Right side**: Agent/Support (blue bubbles #0066CC)
- **Text Alignment**: Right-to-left (RTL) for Arabic text
- **Layout**: Upload area (300px) + Expanded conversation area (full width)
- **Scrollable**: 
  - Smooth scrolling with `scroll-behavior: smooth`
  - Custom scrollbar styling (8px width, gray color)
  - Handles very long transcripts seamlessly
  - Auto-scroll to bottom on new messages
- **Proper Spacing**: 24px padding, 16px gap between messages, 90% max-width
- **Speaker Labels**: Clear identification (👤 Customer, 🎧 Agent)
- **Timestamps**: Aligned with each message
- **Auto-Detection**: If ElevenLabs detects speakers → uses detected speaker info
- **Fallback**: If no speaker detection → auto-alternates speakers (customer, agent, customer...)
- **Smart Splitting**: If no chunks detected → splits by sentences or word count
- **Responsive**: Adjusts padding on smaller screens

### ✅ Configuration Management
- **Config file**: `src/assets/config.json` (centralized settings)
- **ConfigService**: Manages API key, model, and language
- **ConfigLoaderService**: Loads config on app startup
- **localStorage caching**: Settings persist across sessions
- **Runtime updates**: Change settings via UI dialog
- **Environment variables**: TypeScript environment support

### ✅ UI Improvements
- Audio player embedded in message bubbles
- Transcription messages displayed below audio
- Visual indicators for transcription status
- Secure API key storage in browser localStorage and config file

## Configuration (NEW in Phase 2)

### Quick Setup - 3 Steps
1. **Get ElevenLabs API Key**: https://elevenlabs.io/app/subscription → Copy API Key
2. **Update config**: Edit `src/assets/config.json`, replace `your-elevenlabs-api-key-here` with your key
3. **Restart**: `npm start`

### Configuration File
**Location**: `src/assets/config.json`
```json
{
  "transcriptionProvider": "elevenlabs",
  "_comment": "Active Provider: ELEVENLABS | Available: elevenlabs, openai",
  "elevenlabs": {
    "apiKey": "your-elevenlabs-api-key-here",  // Your ElevenLabs API key (UPDATE THIS)
    "model": "scribe_v2",                        // STT Model (scribe_v1, scribe_v1_experimental, scribe_v2)
    "transcriptionLanguage": "ar",               // Language code (ar=Arabic, en=English)
    "enableDiarization": true                    // Enable speaker identification
  },
  "openai": {
    "apiKey": "sk-your-api-key-here",           // OpenAI API key (optional fallback)
    "model": "gpt-4o-transcribe-diarize",
    "transcriptionLanguage": "ar"
  }
}
```

**Provider Status in Browser Console:**
When app loads, check console for:
```
[ConfigLoaderService] 📋 Provider Configuration: {
  provider: "elevenlabs",
  message: "Active Provider: ELEVENLABS | Available: elevenlabs, openai",
  elevenlabsEnabled: true,
  openaiEnabled: false
}
```

### How It Works
- **ConfigService** - Manages API key, model, and language centrally
- **ConfigLoaderService** - Loads `config.json` on app startup
- **localStorage** - Caches settings for persistence across sessions
- **API Key Dialog** - Runtime override via UI (appears if key is empty)

### Services
- `src/app/services/config.service.ts` - Configuration management
- `src/app/services/config-loader.service.ts` - Loads config on startup
- `src/app/services/transcription.service.ts` - Uses config for API calls

### Changing Settings
```json
// Change model (if gpt-4o-transcribe-diarize unavailable)
"model": "whisper-1"

// Change language
"transcriptionLanguage": "en"  // English
"transcriptionLanguage": "fr"  // French
```

## New Components Created

### AudioPlayerComponent
- Location: `src/app/components/audio-player/`
- Features:
  - HTML5 audio playback
  - Play/pause controls
  - Progress tracking
  - Transcription button
  - Time formatting

### ApiKeyDialogComponent
- Location: `src/app/components/api-key-dialog/`
- Features:
  - API key input with show/hide toggle
  - Security information
  - Instructions for getting API key
  - LocalStorage persistence
  - Modal overlay

## How to Test Phase 2

### Step 1: Configure API Key
1. Edit `src/assets/config.json`
2. Replace `sk-your-api-key-here` with your OpenAI API key
3. Save the file

### Step 2: Start Application
```bash
npm start
```

### Step 3: Test Audio & Transcription
1. Upload Arabic audio file (drag-drop or click "Choose Files")
2. Click ▶ play button to preview audio
3. Click 🎤 "Transcribe" button
4. Wait for transcription (shows "Transcribing..." state)
5. See diarized transcription appear as chat bubbles:
   - **Left (gray)**: Customer messages
   - **Right (blue)**: Agent messages

## TESTABLE Deliverable ✓
**Upload audio → Click play → See transcription appear below**

## Architecture Changes

### Updated Services
- `TranscriptionService` - OpenAI API integration
  - `transcribeAudio(file, language)` - Sends to OpenAI Whisper
  - `setApiKey(key)` - Stores key in localStorage
  - `isApiKeySet()` - Checks if key exists

### Updated Components
- `ConversationComponent` - Now includes AudioPlayerComponent
- `AppComponent` - Now includes ApiKeyDialogComponent

## Security Notes
✓ API key stored only in browser localStorage  
✓ Not sent to any server except OpenAI  
✓ Key can be changed anytime via dialog  
✓ Key persists across sessions  

## API Integration
- **Endpoint**: `https://api.openai.com/v1/audio/transcriptions`
- **Model**: `gpt-4o-transcribe-diarize` ⭐ (Native diarization)
- **Language**: Arabic (`ar`)
- **Auth**: Bearer token (your API key)
- **Response Format**: Segments with native speaker labels
  - `speaker_1` → Customer
  - `speaker_2` → Agent
  - Includes: text, start_time, end_time, confidence

## File Structure
```
src/app/
├── components/
│   ├── audio-player/
│   │   ├── audio-player.component.ts
│   │   ├── audio-player.component.html
│   │   └── audio-player.component.scss
│   ├── api-key-dialog/
│   │   ├── api-key-dialog.component.ts
│   │   ├── api-key-dialog.component.html
│   │   └── api-key-dialog.component.scss
│   └── conversation/ (updated)
├── services/
│   ├── transcription.service.ts (updated)
│   └── audio.service.ts
└── ...
```

## Next Phase (Phase 3)
Phase 3 will add:
- Silence detection (>10 seconds)
- QM form auto-population
- Analysis engine for criteria detection
- Form display with detected values

## Testing Checklist
- [ ] App loads
- [ ] API key dialog appears
- [ ] Can enter API key
- [ ] Can upload audio file
- [ ] Audio player controls work
- [ ] Play/pause button toggles
- [ ] Progress bar updates
- [ ] Transcribe button works
- [ ] Transcription appears in chat
- [ ] Transcription language is Arabic

## Debugging with Console Logs

### How to View Logs
1. Open browser DevTools: Press `F12`
2. Go to "Console" tab
3. Look for messages starting with `[ConfigService]`, `[TranscriptionService]`, `[AudioPlayer]`, etc.

### What to Look For

**On App Startup:**
```
[ConfigLoaderService] Loading config.json...
[ConfigLoaderService] ✓ config.json loaded successfully
[ConfigService] Loading configuration...
[ConfigService] ✓ Loaded from localStorage or environment
```

**When Clicking Transcribe:**
```
[AudioPlayer] Transcribe button clicked { fileName: "..." }
[AudioPlayer] ⏳ Starting transcription...
[TranscriptionService] Starting transcription... { model: "gpt-4o-transcribe-diarize", ... }
[TranscriptionService] Sending request to OpenAI API...
[TranscriptionService] ✓ Response received from OpenAI
[AudioPlayer] ✓ Transcription completed successfully
```

**If Error Occurs:**
```
[TranscriptionService] ✗ API key not set!
✗ Transcription failed: { errorMessage: "...", errorStatus: 401, ... }
```

## Troubleshooting

### "Transcription failed" Error
The error dialog now shows the **actual error from OpenAI**. Common errors:

**Invalid API Key**
```
HTTP 401 Error: Unauthorized - API key is invalid or expired
```
→ Check your API key in `src/assets/config.json` is correct

**Model Not Found**
```
OpenAI API Error (invalid_request_error): Model not found: "gpt-4o-transcribe-diarize"
```
→ Model not available - change to `whisper-1` in config.json or check your account access

**Insufficient Quota**
```
OpenAI API Error (insufficient_quota): You exceeded your current quota
```
→ Check https://platform.openai.com/account/billing/overview - add credits

**Rate Limited**
```
HTTP 429 Error: Rate Limited - too many requests, wait and try again
```
→ Wait a moment and retry

**Other errors:**
1. Open browser console (F12 → Console)
2. Look for `[TranscriptionService] ✗ OpenAI API Error:`
3. Error details show exact issue from OpenAI

### Transcription doesn't appear
- Wait for "Transcribing..." state to complete
- Check browser console for `[TranscriptionService]` logs
- Verify API key is set: look for `apiKeySet: true` in logs
- Check network tab (F12 → Network) for API requests

### Audio won't play
- Check browser allows audio playback
- Try a different audio format (MP3, WAV)
- Check browser console for audio-related errors

---
See `SETUP.md` for running instructions.
