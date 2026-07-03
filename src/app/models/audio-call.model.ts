import { DiarizedTranscription } from './transcription.model';

export interface AudioCall {
  id: string;
  fileName: string;
  file?: File;
  fileUrl?: string;
  uploadedAt: Date;
  duration?: number;
  transcription?: string;
  diarizedTranscription?: DiarizedTranscription;
  isTranscribing?: boolean;
  language?: string;
  silenceDuration?: number;
}

export interface Message {
  id: string;
  type: 'audio' | 'transcription' | 'system';
  content?: string;
  audioCall?: AudioCall;
  speaker?: 'agent' | 'customer' | 'unknown';
  timestamp: Date;
  segmentStartTime?: number;
  segmentEndTime?: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
