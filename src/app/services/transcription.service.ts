import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiarizedTranscription } from '../models/transcription.model';
import { ConfigService } from './config.service';
import { ElevenLabsTranscriptionService } from './elevenlabs-transcription.service';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionService {
  constructor(
    private configService: ConfigService,
    private elevenLabsService: ElevenLabsTranscriptionService
  ) {
    console.log('[TranscriptionService] Initialized');
    this.logProviderInfo();
  }

  private logProviderInfo(): void {
    const provider = this.configService.getProvider();
    console.log('[TranscriptionService] Active Provider:', provider);
  }

  setProvider(provider: 'elevenlabs' | 'openai'): void {
    console.log('[TranscriptionService] Switching provider to:', provider);
    this.configService.setProvider(provider);
    this.logProviderInfo();
  }

  setElevenLabsApiKey(key: string): void {
    console.log('[TranscriptionService] Setting ElevenLabs API key');
    this.configService.setElevenLabsConfig({ apiKey: key });
  }

  setOpenAIApiKey(key: string): void {
    console.log('[TranscriptionService] Setting OpenAI API key');
    this.configService.setOpenAIConfig({ apiKey: key });
  }

  transcribeAudioWithDiarization(file: File, language?: string): Observable<DiarizedTranscription> {
    const provider = this.configService.getProvider();

    console.log('[TranscriptionService] Transcribing audio...', {
      provider: provider,
      fileName: file.name,
      language: language || 'default'
    });

    // Delegate to appropriate provider
    if (provider === 'elevenlabs') {
      return this.elevenLabsService.transcribeWithDiarization(file, language);
    }

    // Default to ElevenLabs
    console.log('[TranscriptionService] Using ElevenLabs (default provider)');
    return this.elevenLabsService.transcribeWithDiarization(file, language);
  }

  isApiKeySet(): boolean {
    const provider = this.configService.getProvider();
    const config = this.configService.getActiveProviderConfig();
    const hasKey = !!config?.apiKey;
    const isPlaceholder = config?.apiKey === 'your-elevenlabs-api-key-here' ||
                          config?.apiKey === 'sk-your-api-key-here';

    const result = hasKey && !isPlaceholder;
    console.log('[TranscriptionService] API Key check:', { provider, hasKey, isPlaceholder, result });
    return result;
  }
}
