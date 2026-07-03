import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  transcriptionLanguage: string;
  analysisModel?: string;
}

export interface ElevenLabsConfig {
  apiKey: string;
  model: string;
  transcriptionLanguage: string;
  enableDiarization: boolean;
}

export interface TranscriptionConfig {
  provider: 'elevenlabs' | 'openai';
  elevenlabs?: ElevenLabsConfig;
  openai?: OpenAIConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private transConfig: TranscriptionConfig = this.loadConfig();
  private transConfigSubject = new BehaviorSubject<TranscriptionConfig>(this.transConfig);
  public config$ = this.transConfigSubject.asObservable();

  constructor() {
    this.initializeConfig();
  }

  private loadConfig(): TranscriptionConfig {
    console.log('[ConfigService] Loading configuration...');

    // Try to load from localStorage first
    const stored = localStorage.getItem('transcriptionConfig');
    if (stored) {
      try {
        const config = JSON.parse(stored);
        console.log('[ConfigService] ✓ Loaded from localStorage:', {
          provider: config.provider,
          apiKeySet: !!config[config.provider]?.apiKey
        });
        return config;
      } catch (e) {
        console.error('[ConfigService] ✗ Error parsing localStorage config:', e);
      }
    }

    // Fall back to environment config
    const config: TranscriptionConfig = {
      provider: environment.transcriptionProvider as 'elevenlabs' | 'openai',
      elevenlabs: {
        apiKey: environment.elevenlabs.apiKey || '',
        model: environment.elevenlabs.model,
        transcriptionLanguage: environment.elevenlabs.transcriptionLanguage,
        enableDiarization: environment.elevenlabs.enableDiarization
      },
      openai: {
        apiKey: environment.openai.apiKey || '',
        model: environment.openai.model,
        transcriptionLanguage: environment.openai.transcriptionLanguage
      }
    };

    console.log('[ConfigService] ✓ Using environment config:', {
      provider: config.provider,
      apiKeySet: !!config[config.provider]?.apiKey
    });
    return config;
  }

  private initializeConfig(): void {
    // Migrate old API key if exists
    const oldApiKey = localStorage.getItem('openaiApiKey');
    if (oldApiKey && !this.transConfig.openai?.apiKey) {
      if (!this.transConfig.openai) {
        this.transConfig.openai = {
          apiKey: oldApiKey,
          model: environment.openai.model,
          transcriptionLanguage: environment.openai.transcriptionLanguage
        };
      } else {
        this.transConfig.openai.apiKey = oldApiKey;
      }
      this.saveConfig(this.transConfig);
    }
  }

  getConfig(): TranscriptionConfig {
    return this.transConfig;
  }

  getProvider(): 'elevenlabs' | 'openai' {
    return this.transConfig.provider;
  }

  getElevenLabsConfig(): ElevenLabsConfig | undefined {
    return this.transConfig.elevenlabs;
  }

  getOpenAIConfig(): OpenAIConfig | undefined {
    return this.transConfig.openai;
  }

  getActiveProviderConfig(): ElevenLabsConfig | OpenAIConfig | undefined {
    if (this.transConfig.provider === 'elevenlabs') {
      return this.transConfig.elevenlabs;
    }
    return this.transConfig.openai;
  }

  setProvider(provider: 'elevenlabs' | 'openai'): void {
    this.transConfig.provider = provider;
    this.saveConfig(this.transConfig);
  }

  setElevenLabsConfig(config: Partial<ElevenLabsConfig>): void {
    this.transConfig.elevenlabs = { ...this.transConfig.elevenlabs, ...config } as ElevenLabsConfig;
    this.saveConfig(this.transConfig);
  }

  setOpenAIConfig(config: Partial<OpenAIConfig>): void {
    this.transConfig.openai = { ...this.transConfig.openai, ...config } as OpenAIConfig;
    this.saveConfig(this.transConfig);
  }

  private saveConfig(config: TranscriptionConfig): void {
    console.log('[ConfigService] Saving configuration:', {
      provider: config.provider,
      apiKeySet: !!config[config.provider]?.apiKey
    });
    this.transConfig = config;
    this.transConfigSubject.next(config);
    localStorage.setItem('transcriptionConfig', JSON.stringify(config));
    console.log('[ConfigService] ✓ Configuration saved');
  }

  resetToDefault(): void {
    const defaultConfig: TranscriptionConfig = {
      provider: environment.transcriptionProvider as 'elevenlabs' | 'openai',
      elevenlabs: {
        apiKey: '',
        model: environment.elevenlabs.model,
        transcriptionLanguage: environment.elevenlabs.transcriptionLanguage,
        enableDiarization: environment.elevenlabs.enableDiarization
      },
      openai: {
        apiKey: '',
        model: environment.openai.model,
        transcriptionLanguage: environment.openai.transcriptionLanguage
      }
    };
    this.saveConfig(defaultConfig);
  }
}
