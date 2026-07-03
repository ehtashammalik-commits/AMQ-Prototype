export interface SpeakerSegment {
  speaker: 'agent' | 'customer' | 'unknown';
  text: string;
  startTime?: number;
  endTime?: number;
  confidence?: number;
}

export interface DiarizedTranscription {
  fullText: string;
  segments: SpeakerSegment[];
  duration?: number;
  language?: string;
  hasMultipleSpeakers: boolean;
}
