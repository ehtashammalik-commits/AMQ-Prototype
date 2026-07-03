import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigLoaderService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  loadConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[ConfigLoaderService] Loading config.json...');

      this.http.get<any>('/assets/config.json').subscribe({
        next: (config) => {
          console.log('[ConfigLoaderService] ✓ config.json loaded successfully');
          console.log('[ConfigLoaderService] 📋 Provider Configuration:', {
            provider: config.transcriptionProvider,
            message: config._comment,
            elevenlabsEnabled: !!config.elevenlabs?.apiKey && config.elevenlabs.apiKey !== 'your-elevenlabs-api-key-here',
            openaiEnabled: !!config.openai?.apiKey && config.openai.apiKey !== 'sk-your-api-key-here'
          });

          // Load ElevenLabs config (for transcription if selected)
          if (config.elevenlabs) {
            console.log('[ConfigLoaderService] Applying ElevenLabs configuration:', {
              model: config.elevenlabs.model,
              language: config.elevenlabs.transcriptionLanguage,
              apiKeySet: !!config.elevenlabs.apiKey
            });

            this.configService.setElevenLabsConfig({
              apiKey: config.elevenlabs.apiKey,
              model: config.elevenlabs.model,
              transcriptionLanguage: config.elevenlabs.transcriptionLanguage,
              enableDiarization: config.elevenlabs.enableDiarization
            });

            console.log('[ConfigLoaderService] ✓ ElevenLabs configuration applied');
          }

          // Load OpenAI config (for analysis OR transcription)
          if (config.openai) {
            console.log('[ConfigLoaderService] Applying OpenAI configuration:', {
              transcriptionModel: config.openai.model,
              analysisModel: config.openai.analysisModel,
              language: config.openai.transcriptionLanguage,
              apiKeySet: !!config.openai.apiKey
            });

            this.configService.setOpenAIConfig({
              apiKey: config.openai.apiKey,
              model: config.openai.model,
              transcriptionLanguage: config.openai.transcriptionLanguage,
              analysisModel: config.openai.analysisModel
            });

            console.log('[ConfigLoaderService] ✓ OpenAI configuration applied');
          }

          if (!config.elevenlabs && !config.openai) {
            console.warn('[ConfigLoaderService] ⚠️ No transcription config found in config.json');
          }

          resolve();
        },
        error: (err) => {
          console.error('[ConfigLoaderService] ✗ Error loading config.json:', err);
          console.log('[ConfigLoaderService] Using fallback configuration');
          // Don't reject - use defaults if file not found
          resolve();
        }
      });
    });
  }
}
