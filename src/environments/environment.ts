export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:4200',

  // Transcription Provider (elevenlabs or openai)
  transcriptionProvider: 'elevenlabs',

  // ElevenLabs Configuration
  elevenlabs: {
    apiEndpoint: 'https://api.elevenlabs.io/v1',
    apiKey: '',
    model: 'scribe_v2',
    transcriptionLanguage: 'ar',
    enableDiarization: true
  },

  // OpenAI Configuration (transcription and analysis)
  openai: {
    apiEndpoint: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4o-transcribe-diarize',
    transcriptionLanguage: 'ar',
    analysisModel: 'gpt-4o'
  },

  features: {
    audioPlayback: true,
    transcription: true,
    silenceDetection: false,
    qmForm: false
  }
};
