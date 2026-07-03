import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DiarizedTranscription, SpeakerSegment } from '../models/transcription.model';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElevenLabsTranscriptionService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  transcribeWithDiarization(file: File, language?: string): Observable<DiarizedTranscription> {
    const config = this.configService.getElevenLabsConfig();

    if (!config?.apiKey) {
      console.error('[ElevenLabsService] ✗ API key not set!');
      return from(Promise.reject('ElevenLabs API key not set'));
    }

    if (config.apiKey === 'your-elevenlabs-api-key-here') {
      console.error('[ElevenLabsService] ✗ API key is still the template placeholder!');
      return from(Promise.reject('Please set a valid ElevenLabs API key in config.json'));
    }

    const transcriptionLanguage = language || config.transcriptionLanguage;

    console.log('[ElevenLabsService] Starting transcription...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      model: config.model,
      language: transcriptionLanguage,
      diarization: config.enableDiarization,
      apiKeyLength: config.apiKey?.length || 0
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_id', config.model);
    formData.append('language_code', this.mapLanguageCode(transcriptionLanguage));

    if (config.enableDiarization) {
      formData.append('identify_speakers', 'true');
    }

    console.log('[ElevenLabsService] Sending request to ElevenLabs API...', {
      endpoint: `${environment.elevenlabs.apiEndpoint}/speech-to-text`,
      model: config.model,
      language: transcriptionLanguage
    });

    return this.http.post<any>(
      `${environment.elevenlabs.apiEndpoint}/speech-to-text`,
      formData,
      {
        headers: {
          'xi-api-key': config.apiKey
        }
      }
    ).pipe(
      map(response => {
        console.log('[ElevenLabsService] ✓ Response received from ElevenLabs', {
          hasChunks: !!response.chunks,
          chunkCount: response.chunks?.length || 0,
          textLength: response.text?.length || 0
        });
        return this.parseDiarization(response);
      }),
      catchError((error) => {
        const errorDetails = this.parseElevenLabsError(error);
        console.error('[ElevenLabsService] ✗ ElevenLabs API Error:', errorDetails);
        return from(Promise.reject(errorDetails.message));
      })
    );
  }

  private parseDiarization(response: any): DiarizedTranscription {
    const segments: SpeakerSegment[] = [];
    let hasSpeakerInfo = false;

    // Parse ElevenLabs response with speaker diarization
    if (response.chunks && Array.isArray(response.chunks)) {
      response.chunks.forEach((chunk: any, index: number) => {
        let speaker: 'agent' | 'customer' | 'unknown' = 'unknown';

        // Try to map speaker from speaker_id
        if (chunk.speaker_id !== undefined && chunk.speaker_id !== null) {
          speaker = this.mapSpeaker(chunk.speaker_id);
          hasSpeakerInfo = true;
        }

        // If no speaker detected, alternate speakers (customer, agent, customer, agent, ...)
        if (speaker === 'unknown') {
          speaker = index % 2 === 0 ? 'customer' : 'agent';
        }

        segments.push({
          speaker: speaker,
          text: chunk.text || '',
          startTime: chunk.start_time,
          endTime: chunk.end_time,
          confidence: chunk.confidence || 0.9
        });
      });

      console.log('[ElevenLabsService] Diarization Info:', {
        totalChunks: segments.length,
        hasSpeakerDetection: hasSpeakerInfo,
        speakers: segments.map(s => s.speaker)
      });
    } else if (response.text) {
      // Fallback: if no chunks, split text into sentences and alternate speakers
      const sentences = this.splitIntoSentences(response.text);
      sentences.forEach((sentence, index) => {
        segments.push({
          speaker: index % 2 === 0 ? 'customer' : 'agent',
          text: sentence,
          confidence: 0.85
        });
      });

      console.log('[ElevenLabsService] No chunks detected. Auto-splitting into sentences:', {
        sentenceCount: sentences.length,
        speakers: segments.map(s => s.speaker)
      });
    }

    const fullText = segments.map(s => s.text).join(' ');
    const hasMultipleSpeakers = segments.some(s => s.speaker === 'agent') &&
                                segments.some(s => s.speaker === 'customer');

    return {
      fullText,
      segments,
      language: 'ar',
      hasMultipleSpeakers
    };
  }

  private splitIntoSentences(text: string): string[] {
    // Split by Arabic sentence markers and common punctuation
    const sentences = text.split(/[۔\.!\?؟\n]+/).filter(s => s.trim().length > 0);

    // If only one sentence, split by length for better conversation flow
    if (sentences.length <= 1) {
      const words = text.split(' ');
      const chunks: string[] = [];
      let chunk = '';

      words.forEach((word, index) => {
        chunk += (chunk ? ' ' : '') + word;

        // Create new chunk every 15 words or at end
        if ((index + 1) % 15 === 0 || index === words.length - 1) {
          if (chunk.trim()) {
            chunks.push(chunk.trim());
            chunk = '';
          }
        }
      });

      return chunks.length > 0 ? chunks : [text];
    }

    return sentences;
  }

  private mapLanguageCode(language: string): string {
    const languageMap: { [key: string]: string } = {
      'ar': 'ar',      // Arabic
      'en': 'en',      // English
      'fr': 'fr',      // French
      'es': 'es',      // Spanish
      'de': 'de',      // German
      'it': 'it',      // Italian
      'pt': 'pt',      // Portuguese
      'zh': 'zh',      // Chinese
      'ja': 'ja',      // Japanese
      'ko': 'ko'       // Korean
    };
    return languageMap[language] || language;
  }

  private mapSpeaker(speakerId: string | number): 'agent' | 'customer' | 'unknown' {
    if (!speakerId) return 'unknown';

    const id = String(speakerId).toLowerCase();

    // Map speaker IDs to customer/agent
    // Typically: first speaker = customer, second speaker = agent
    if (id === '0' || id === 'speaker_0' || id === 'customer') {
      return 'customer';
    }
    if (id === '1' || id === 'speaker_1' || id === 'agent') {
      return 'agent';
    }

    // If numeric, even = customer, odd = agent
    const num = parseInt(id.replace(/\D/g, ''));
    if (!isNaN(num)) {
      return num % 2 === 0 ? 'customer' : 'agent';
    }

    return 'unknown';
  }

  private parseElevenLabsError(error: any): { message: string; code: string; status: number } {
    console.log('[ElevenLabsService] Parsing error response...', error);

    if (error.error) {
      const errorBody = error.error;

      // ElevenLabs error format
      if (errorBody.detail || errorBody.message) {
        let message = errorBody.detail || errorBody.message || 'Unknown error';

        // Ensure message is a string
        if (typeof message !== 'string') {
          message = JSON.stringify(message);
        }

        console.error('[ElevenLabsService] ElevenLabs Error Response:', {
          message: message,
          code: error.status
        });

        if (error.status === 401 || (message && message.includes('api_key'))) {
          return {
            message: `Invalid API Key: ${message}. Check your config.json ElevenLabs API key.`,
            code: 'INVALID_API_KEY',
            status: 401
          };
        }

        if (error.status === 400) {
          return {
            message: `Bad Request: ${message}. Check audio file format and ElevenLabs API key in config.json.`,
            code: 'BAD_REQUEST',
            status: 400
          };
        }

        if (error.status === 429) {
          return {
            message: `Rate Limited: ${message}. Wait a moment and try again.`,
            code: 'RATE_LIMIT',
            status: 429
          };
        }

        return {
          message: `ElevenLabs API Error (${error.status}): ${message}`,
          code: 'ELEVENLABS_ERROR',
          status: error.status || 400
        };
      }
    }

    // HTTP error without response body
    if (error.status) {
      const statusMessages: { [key: number]: string } = {
        0: 'Network error - check if ElevenLabs API is reachable',
        400: 'Bad Request - check audio file and parameters',
        401: 'Unauthorized - API key is invalid or expired',
        403: 'Forbidden - API key does not have permission',
        404: 'Not Found - endpoint not found',
        429: 'Rate Limited - too many requests, wait and try again',
        500: 'ElevenLabs Server Error - try again later',
        503: 'Service Unavailable - ElevenLabs is down'
      };

      return {
        message: `HTTP ${error.status} Error: ${statusMessages[error.status] || error.message}`,
        code: `HTTP_${error.status}`,
        status: error.status
      };
    }

    return {
      message: `Unknown Error: ${error.message || JSON.stringify(error)}`,
      code: 'UNKNOWN_ERROR',
      status: 0
    };
  }
}
