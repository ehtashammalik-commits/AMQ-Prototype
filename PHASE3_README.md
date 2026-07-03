# Phase 3: QM Form Auto-Population & Analysis - In Progress 🚀

## Phase 2 Recap ✓
**Phase 2 is LOCKED and COMPLETE**
- ✅ Audio upload & file management
- ✅ ElevenLabs transcription with speaker diarization
- ✅ Single audio selection (only selected audio shows)
- ✅ Expanded UI layout with proper spacing
- ✅ Arabic language support with RTL display
- ✅ Segment timing for future enhancements

---

## Phase 3: QM Compliance Checklist & Smart Analysis

### Objectives
1. **Initial Greeting Detection** - Verify agent provided proper greeting
2. **Silence Detection** - Detect gaps >10 seconds between speakers
3. **Information Gathering** - Verify agent collected:
   - Location details
   - Incident details
   - Required medical/emergency information
4. **QM Checklist Display** - Show compliance items with pass/fail status
5. **Auto-Detection** - Analyze transcription for compliance markers

### Key Features (Planned)

#### ✅ QM Compliance Checklist
```
Quality Management Checklist
├── ✓ Initial Greeting
│   └── Agent provided proper greeting at call start
├── ✓ Silence Detection (>10 seconds)
│   └── Identify unacceptable silence gaps
├── ✓ Location Information
│   └── Agent asked for and received location details
├── ✓ Incident Information
│   └── Agent asked for and received incident details
└── ✓ Medical/Emergency Information
    └── Agent asked for required medical or emergency info
```

#### 🔇 Silence Detection (>10 seconds)
- Analyze timestamps between speaker turns
- Flag gaps exceeding 10 seconds
- Show silence duration and timestamp
- Mark in transcription with visual indicator
- Track total silence percentage

#### 👋 Initial Greeting Detection
- Check first agent message for greeting keywords
- Detect formal salutation (Arabic: "السلام عليكم", "مرحبا", "صباح الخير")
- Verify within first 30 seconds of call
- Status: Pass/Fail

#### 📍 Information Gathering Detection
- **Location**: Keywords like "موقع", "عنوان", "مكان", "أين" (where, location, address)
- **Incident**: Keywords like "حادث", "مشكلة", "قضية", "ما حدث" (incident, problem, issue, what happened)
- **Medical/Emergency**: Keywords like "إصابة", "طوارئ", "إسعاف", "طبي" (injury, emergency, ambulance, medical)
- Status: ✓ Asked, ✓ Received, ✗ Missing

#### 🤖 Auto-Detection Keywords (Arabic)
```
Greeting: السلام, مرحبا, صباح, مساء, أهلا, أخبار
Location: موقع, عنوان, مكان, أين, المنطقة, الشارع
Incident: حادث, مشكلة, قضية, ما حدث, وقع, حدث
Medical: إصابة, طوارئ, إسعاف, طبي, نزيف, ألم
```

#### 📊 Call Metrics Dashboard
```
Duration: 1m 27s
Total Silence: 15 seconds
Customer Turns: 3
Agent Turns: 4
Average Response Time: 2.3s
```

### Implementation Plan

#### Step 1: QM Compliance Service
- Create `qm-compliance.service.ts`
- Define keyword matching for Arabic
- Implement detection logic for each checklist item
- Return compliance status with confidence scores

#### Step 2: Silence Detection Service
- Create `silence-detection.service.ts`
- Analyze segment timestamps
- Identify gaps > 10 seconds
- Return silence data with timestamps and duration

#### Step 3: Information Gathering Detector
- Detect "Location Information" asked/received
- Detect "Incident Information" asked/received
- Detect "Medical/Emergency Information" asked/received
- Return detection status for each

#### Step 4: Initial Greeting Detector
- Analyze first agent message (within 30 seconds)
- Match against greeting keywords (Arabic)
- Return Pass/Fail status

#### Step 5: QM Checklist Component
- Create `qm-checklist.component.ts/html/scss`
- Display 5 compliance items with checkmarks
- Show detection status (✓ Pass, ✗ Fail, ? Unknown)
- Add confidence score for each item
- Style with ExpertFlow design (blue checkmarks for pass)

#### Step 6: Integration with Conversation
- Place QM Checklist below transcription
- Update checklist when audio is selected
- Auto-analyze when transcription loads
- Allow manual override of detected values

### Data Flow
```
Transcription (with timestamps)
    ↓
Silence Detection Service
    ↓
Form Population Service (with Sentiment Analysis)
    ↓
QM Form Component (auto-filled values)
    ↓
User Review & Manual Edit
    ↓
Save to LocalStorage / Backend
```

### API/Services Needed

#### New Services
1. **SilenceDetectionService** - Detect silence gaps
2. **FormPopulationService** - Auto-fill form fields
3. **SentimentAnalysisService** - Arabic sentiment detection
4. **MetricsService** - Calculate call metrics

#### External APIs (Optional)
- Sentiment API (e.g., Google Cloud NLP, Azure Text Analytics) - Optional for Phase 3
- Or use rule-based keywords approach for MVP

### Testing Checklist
- [ ] Initial Greeting detection works (Arabic keywords)
- [ ] Silence detection identifies gaps > 10 seconds
- [ ] Location information detection works
- [ ] Incident information detection works
- [ ] Medical/Emergency information detection works
- [ ] QM Checklist displays below transcription
- [ ] Checklist updates when audio is selected
- [ ] Pass/Fail status displays correctly
- [ ] Confidence scores show accuracy
- [ ] Manual override allowed
- [ ] Data persists in localStorage

### Success Criteria
✓ All 5 compliance checks detect correctly  
✓ Silence gaps >10s identified with timestamps  
✓ Arabic keyword matching works accurately  
✓ Confidence scores displayed for each item  
✓ User can manually override auto-detection  
✓ QM Checklist saves to localStorage  
✓ Works seamlessly with audio selection  
✓ Clear visual indicators (✓ Pass, ✗ Fail)  

### Next Phase (Phase 4)
- Backend API integration for form submission
- Database storage for QM data
- Reporting & analytics dashboard
- Multi-call comparison
- Compliance reporting

---

## How to Start Phase 3

1. Review this roadmap
2. Start with Silence Detection Service
3. Build QM Form UI
4. Implement auto-population logic
5. Test with real transcriptions
6. Refine based on feedback

---

**Status**: Ready to begin Phase 3 implementation  
**Est. Duration**: 5-7 days for MVP  
**Tech Stack**: Angular 18, RxJS, TypeScript, localStorage  
