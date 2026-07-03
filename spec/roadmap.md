# Roadmap

## Phase 1: Setup & Core Structure (0-30 min)
**Working Deliverable**: Basic Angular app with layout & file upload
- [ ] Initialize Angular project with dependencies
- [ ] Create main layout matching ExpertFlow design (sidebar, header, conversation area)
- [ ] Build file upload component for audio files
- [ ] Set up TypeScript models and interfaces
- [ ] Configure OpenAI API service
- **TESTABLE**: Upload audio file and display in conversation list

## Phase 2: Audio & Transcription with Diarization & Configuration (30-90 min)
**Working Deliverable**: Audio playback + ElevenLabs transcription with proper UI + Config management
- [x] Create audio player component with play/pause controls
- [x] Implement ElevenLabs STT transcription service with diarization
- [x] Add speaker diarization to identify Agent vs Customer
- [x] Parse transcription with speaker labels
- [x] Build conversation view with proper chat bubbles
- [x] Display transcription as dialogue between two speakers
- [x] Handle real audio file playback
- [x] Create configuration system with multi-provider support
- [ ] **FIX UI LAYOUT** (IN PROGRESS)
  - [x] Customer messages: Left side (gray bubbles) ✓
  - [x] Agent messages: Right side (blue bubbles) ✓
  - [ ] **EXPAND conversation card to maximum width** - NOT EXPANDING FULLY
  - [ ] **ENABLE SCROLLING** - Messages not scrolling on long transcripts
  - [ ] Proper text alignment (left-aligned customer, right-aligned agent) ✓
  - [ ] Optimize spacing and padding ✓
  - [ ] Test with various transcript lengths
- [ ] Add smart speaker fallback (alternate if not detected)
- **TESTABLE**: 
  1. Update config.json with ElevenLabs API key
  2. Restart app
  3. Upload audio → Click play → See diarized transcription
  4. Verify: Customer left, Agent right, scrollable, proper alignment

## Phase 3: QM Form & Analysis (60-90 min)
**Working Deliverable**: Auto-populated QM form with silence detection
- [ ] Implement silence detection logic using Web Audio API (>10 seconds)
- [ ] Build QM evaluation form component
- [ ] Create transcription analysis engine (detect greeting, location ask, incident ask, etc.)
- [ ] Auto-populate form fields based on detection
- [ ] Display analysis results visually
- **TESTABLE**: Upload audio → See form auto-populate with detected criteria

## Phase 4: Polish & Launch (90-120 min)
**Working Deliverable**: Complete, polished application ready for demo
- [ ] UI/UX refinements to match ExpertFlow screenshot exactly
- [ ] Test all features end-to-end
- [ ] Bug fixes and edge case handling
- [ ] Add loading states and error handling
- [ ] Create sample audio files for demo (if needed)
- **TESTABLE**: Full working demo with sample data

## Phase 5: Docker & Kubernetes Deployment (Milestone)
**Working Deliverable**: Production-ready Docker image deployable on Kubernetes
- [ ] Create Dockerfile with multi-stage build
- [ ] Configure Docker image for Angular application
- [ ] Create docker-compose.yml for local testing
- [ ] Build Kubernetes deployment manifests (deployment.yaml, service.yaml)
- [ ] Configure environment variables for OpenAI API key
- [ ] Create ConfigMap for application configuration
- [ ] Add health checks and readiness probes
- [ ] Document deployment instructions
- **TESTABLE**: Docker image builds successfully, deploys on Kubernetes cluster, application accessible via service
