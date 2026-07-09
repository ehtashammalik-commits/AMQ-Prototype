# Roadmap

## Phase 1: Setup & Core Structure ✅ COMPLETE
**Working Deliverable**: Basic Angular app with layout & file upload
- [x] Initialize Angular project with dependencies
- [x] Create main layout matching ExpertFlow design (sidebar, header, conversation area)
- [x] Build file upload component for audio files
- [x] Set up TypeScript models and interfaces
- [x] Configure API services
- **TESTABLE**: Upload audio file and display in conversation list ✓

## Phase 2: Audio & Transcription with Diarization ✅ COMPLETE
**Working Deliverable**: Audio playback + ElevenLabs transcription with proper UI + Config management
- [x] Create audio player component with play/pause controls
- [x] Implement ElevenLabs STT transcription service with diarization
- [x] Add speaker diarization to identify Agent vs Customer
- [x] Parse transcription with speaker labels
- [x] Build conversation view with proper chat bubbles
- [x] Display transcription as dialogue between two speakers
- [x] Handle real audio file playback
- [x] Create configuration system with multi-provider support
- [x] Customer messages: Left side (gray bubbles)
- [x] Agent messages: Right side (blue bubbles)
- [x] Proper text alignment and scrolling
- [x] Add smart speaker fallback (alternate if not detected)
- **TESTABLE**: Upload audio → Click play → See diarized transcription ✓

## Phase 3: QM Compliance with LLM Analysis ✅ COMPLETE
**Working Deliverable**: LLM-powered QM analysis with confidence scores
- [x] Create QM compliance analysis service
- [x] Implement OpenAI GPT-4o integration for intelligent analysis
- [x] Build QM checklist component showing 6 criteria:
  - [x] Initial Greeting verification
  - [x] Silence Detection (>10 seconds)
  - [x] Location Information request
  - [x] Incident Details collection
  - [x] Medical/Emergency Information
  - [x] Overall Call Quality Score
- [x] Display analysis results with pass/fail/unknown status
- [x] Show confidence scores (0-100%)
- [x] Auto-reset analysis when file changes
- [x] Secure API key management (no keys in config)
- **TESTABLE**: Upload audio → Transcribe → Generate Analysis → See LLM results ✓

## Phase 3.1: ExpertFlow CIM Integration 📋 IN PROGRESS
**Working Deliverable**: Push transcriptions to ExpertFlow API with message type selection
- [ ] Generate unique Conversation ID per audio file
- [ ] Create ExpertFlow API service for CIM endpoint
- [ ] Build conversation management service
- [ ] Add "Push to CIM" button on each transcription message
- [ ] Create message type selector dialog (Agent/Customer)
- [ ] Implement payload builder (Agent & Customer message formats)
- [ ] Handle ExpertFlow API authentication (Bearer token)
- [ ] Add success/error feedback UI
- [ ] Implement retry mechanism for failed pushes
- [ ] Add ExpertFlow settings tab (API endpoint, credentials)
- [ ] Store ExpertFlow configuration securely
- [ ] Display conversation ID in UI (with copy button)
- **Timeline**: 9-10 hours estimated
- **TESTABLE**: 
  1. Upload audio and generate transcription
  2. See unique Conversation ID displayed
  3. Click "Push to CIM" on a message
  4. Select message type (Agent/Customer)
  5. Message posts to ExpertFlow CIM API
  6. See success confirmation
  
**API Endpoint**: `https://missouri.expertflow.com/conversation-manager/customer-topics/{CONVERSATION_ID}/events`

**See detailed spec**: [Phase 3.1 Roadmap](../PHASE3_1_ROADMAP.md)

## Phase 4: Polish & Optimization (Future)
**Working Deliverable**: Complete, polished application ready for production
- [ ] UI/UX refinements
- [ ] Performance optimization
- [ ] Test all features end-to-end
- [ ] Bug fixes and edge case handling
- [ ] Add analytics and monitoring
- [ ] Create comprehensive documentation
- **TESTABLE**: Full working production-ready app

## Phase 5: Docker & Kubernetes Deployment (Future)
**Working Deliverable**: Production-ready Docker image deployable on Kubernetes
- [ ] Create Dockerfile with multi-stage build
- [ ] Configure Docker image for Angular application
- [ ] Create docker-compose.yml for local testing
- [ ] Build Kubernetes deployment manifests
- [ ] Configure environment variables for API keys
- [ ] Create ConfigMap for application configuration
- [ ] Add health checks and readiness probes
- [ ] Document deployment instructions
- **TESTABLE**: Docker image builds and deploys on Kubernetes cluster
