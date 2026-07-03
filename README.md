# QM Transcription App with LLM Analysis

🎯 **Intelligent Quality Management (QM) transcription mockup application** that automatically transcribes Arabic audio calls and evaluates QM compliance using advanced AI.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Angular](https://img.shields.io/badge/angular-18-red)

---

## ✨ Features

- 🎤 **Audio Upload & Playback** - Drag & drop support for MP3, WAV, M4A, WebM, OGG
- 🗣️ **Arabic Transcription** - Automatic speech-to-text using ElevenLabs Scribe
- 👥 **Speaker Diarization** - Identifies "Agent" vs "Customer" in conversations
- 🤖 **LLM-Powered QM Analysis** - GPT-4o intelligent compliance evaluation
- ✅ **Automated Checklist** - Evaluates 6 QM criteria:
  - Initial Greeting verification
  - Silence Detection (>10 seconds)
  - Location Information request
  - Incident Details collection
  - Medical/Emergency Information
  - Overall Call Quality Score
- 💾 **Browser Storage** - All data persisted locally
- 🔐 **Secure** - API keys never stored in code, only in browser

---

## 🚀 Quick Start

### **Live Demo**
🌐 Visit: https://ehtashammalik-commits.github.io/AMQ-Prototype/

### **What You Need**

Before using the app, you'll need **2 API keys** (both free tier available):

| Service | What It Does | Sign Up |
|---------|------------|---------|
| **ElevenLabs** | Transcribes audio to text (Arabic) | https://elevenlabs.io |
| **OpenAI** | AI analysis of transcriptions | https://platform.openai.com |

---

## 📋 Full Usage Guide

### **Step 1️⃣: Get Your API Keys**

#### **Option A: ElevenLabs (Transcription)**
1. Go to https://elevenlabs.io
2. Sign up for a free account
3. Navigate to **Settings → API Keys**
4. Copy your API key (starts with `xi_`)
5. Keep it safe - you'll need it in the app

#### **Option B: OpenAI (Analysis)**
1. Go to https://platform.openai.com/account/api-keys
2. Sign up or log in with your account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)
5. Save it - you'll need it in the app

---

### **Step 2️⃣: Configure API Keys in the App**

1. **Open the app** → https://ehtashammalik-commits.github.io/AMQ-Prototype/

2. **Click the ⚙️ Settings button** (top-right corner)

3. **A dialog opens with 2 tabs:**

   **Tab 1: Transcription Model (ElevenLabs)**
   ```
   - Paste your ElevenLabs API key
   - Model: scribe_v2 (automatic)
   - Language: Arabic (ar)
   - Click "Save Transcription Key"
   ```

   **Tab 2: Analysis Model (OpenAI)**
   ```
   - Paste your OpenAI API key
   - Model: GPT-4o (automatic)
   - Click "Save Analysis Key"
   ```

4. **Keys are now saved** in your browser's local storage (secure, never sent to servers)

---

### **Step 3️⃣: Upload Audio**

1. **Drag & drop** an audio file onto the "Upload Audio Calls" area
   - **OR** click "Choose Files" button

2. **Supported formats:** MP3, WAV, M4A, WebM, OGG

3. **File appears** in the conversation area below

**Example:**
```
📁 Uploaded Files (1)
  ✓ call-2024-07-03-1530.wav
```

---

### **Step 4️⃣: Transcribe the Audio**

1. **Click the audio file** to select it
   - File appears highlighted in blue

2. **Audio player appears** with:
   - ▶️ Play button
   - 🔊 Volume control
   - ⏱️ Timeline

3. **Click "Transcribe"** button
   - Status shows: "Transcribing..."
   - ⏳ Wait 30-60 seconds (depends on audio length)

4. **Transcription appears** in the chat as messages:
   ```
   🤖 Agent: "السلام عليكم، كيف حالك؟"
   👤 Customer: "بخير شكراً، لدي مشكلة..."
   ```

**What's happening:**
- ElevenLabs converts audio → text
- Identifies who is speaking (Agent/Customer)
- Shows timestamps for each segment

---

### **Step 5️⃣: Generate QM Analysis**

1. **Scroll down** to the "QM Compliance Analysis" section

2. **Click "Generate Analysis"** button
   - Status shows: "Analyzing..."
   - ⏳ Wait 5-15 seconds

3. **Results appear** showing 6 criteria:

#### **Analysis Results Example:**
```
✓ Initial Greeting        [PASS]  95% confidence
  ✓ Keywords found: السلام, مرحبا

✗ Silence Detection       [FAIL]  99% confidence
  ⚠️ 2 silence gap(s) detected. Max: 15.2s

✓ Location Information    [PASS]  87% confidence
  ✓ Keywords found: عنوان, موقع

✓ Incident Information    [PASS]  91% confidence
  ✓ Keywords found: مشكلة, حادث

✗ Medical/Emergency Info  [FAIL]  98% confidence
  ✗ No medical keywords detected

📊 Overall Score: 60%
```

**What the LLM is doing:**
- Reading the full transcription
- Understanding context (not just keywords)
- Evaluating call quality
- Providing confidence scores
- Generating detailed assessments

---

### **Step 6️⃣: Select a Different File**

When you click a **different audio file:**
1. The analysis **automatically resets**
2. Previous results are cleared
3. Click "Generate Analysis" again for the new file

---

## 🎯 Understanding the Results

### **Status Colors:**
- 🟢 **PASS** - Criteria met successfully
- 🔴 **FAIL** - Criteria not met
- ⚪ **UNKNOWN** - Insufficient data

### **Confidence Score:**
- 95-100% = High confidence (AI is very sure)
- 70-94% = Medium confidence (AI is reasonably sure)
- 0-69% = Low confidence (AI is uncertain)

### **Overall Score:**
- **80-100%** = Excellent call quality ⭐⭐⭐
- **60-79%** = Good call quality ⭐⭐
- **40-59%** = Fair call quality ⭐
- **0-39%** = Needs improvement

---

## 🔧 Advanced Configuration

### **Change Transcription Model**
Edit the settings dialog:
- Default: `scribe_v2` (recommended)
- Language: Arabic (ar)

### **Change Analysis Model**
Edit the settings dialog:
- Default: `gpt-4o` (latest, recommended)
- Options: `gpt-4-turbo`, `gpt-4`

### **Clear All Data**
Open browser DevTools (F12) → Application → Local Storage → Delete all

---

## 🔐 Security & Privacy

✅ **Your API Keys Are Safe:**
- Stored only in **browser's local storage**
- Never sent to our servers
- Only sent directly to OpenAI/ElevenLabs
- Can be deleted anytime from Settings

✅ **Your Audio is Private:**
- Audio files never uploaded to our servers
- Only sent to ElevenLabs for transcription
- Not stored or logged
- You control all data

✅ **No Account Needed:**
- No login required
- No personal data collected
- Works completely offline (after config)

---

## 💰 Cost Considerations

### **ElevenLabs**
- **Free tier:** 10,000 characters/month
- **Pricing:** ~$0.30 per 1M characters
- Each transcription uses ~1-5K characters

### **OpenAI**
- **GPT-4o pricing:** ~$0.015 per 1K input tokens
- Each analysis uses ~500-2000 tokens
- Typical cost per analysis: $0.01-0.03

**Estimate:** 
- 100 calls/month ≈ $1-3 total cost

---

## 📱 Browser Support

| Browser | Support |
|---------|---------|
| Chrome/Chromium | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| Mobile (iOS/Android) | ⚠️ Works but audio upload limited |

---

## 🛠️ Troubleshooting

### **Error: "API key not configured"**
→ Click ⚙️ Settings → Enter your API key → Save

### **Error: "OpenAI API key not set!"**
→ Go to Analysis tab → Paste your OpenAI key → Save

### **Transcription is slow**
→ Normal! Long audio (30+ min) can take 2-3 minutes

### **Analysis failed: Rate limit exceeded**
→ You've hit OpenAI rate limits → Wait 1 minute → Retry

### **Audio won't play**
→ Check browser supports format (usually MP3 works universally)

### **Keys disappeared after closing browser**
→ LocalStorage might be cleared → Re-enter keys in Settings

---

## 💡 Tips & Tricks

1. **Test with short audio first** (1-2 min) to verify setup
2. **Use high-quality recordings** for better transcription
3. **Ensure clear audio** (minimize background noise)
4. **Save your API keys** somewhere safe (use password manager)
5. **Monitor your API costs** on OpenAI/ElevenLabs dashboards

---

## 📚 Project Architecture

```
QM Transcription App
├── 🎨 Frontend (Angular 18)
│   ├── Components
│   │   ├── file-upload/ (Drag & drop)
│   │   ├── audio-player/ (Playback controls)
│   │   ├── conversation/ (Chat view)
│   │   ├── qm-checklist/ (Analysis results)
│   │   └── api-key-dialog/ (Settings)
│   ├── Services
│   │   ├── transcription.service (ElevenLabs)
│   │   ├── openai-qm-analysis.service (GPT-4o)
│   │   ├── audio.service (File management)
│   │   └── config.service (Key management)
│   └── Models
│       ├── audio-call.model
│       └── qm-compliance.model
├── 📝 Config
│   ├── config.json (Empty - user provides keys)
│   └── .gitignore (Prevents key commits)
└── 🚀 Deployment
    └── GitHub Pages (Automatic)
```

---

## 🤝 Support & Feedback

- **Report Issues:** https://github.com/ehtashammalik-commits/AMQ-Prototype/issues
- **View Source:** https://github.com/ehtashammalik-commits/AMQ-Prototype
- **Follow Updates:** Star ⭐ the repository

---

## 📄 License

MIT License - Feel free to use, modify, and distribute

---

## 🎉 Getting Started Now

1. ➡️ **Visit:** https://ehtashammalik-commits.github.io/AMQ-Prototype/
2. ➡️ **Get API keys** from ElevenLabs & OpenAI
3. ➡️ **Enter keys** in Settings (⚙️)
4. ➡️ **Upload audio** and start analyzing!

**Questions?** Open an issue on GitHub or check the troubleshooting section above.

---

**Made with ❤️ for Quality Management Excellence**
