import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranscriptionService } from '../../services/transcription.service';

@Component({
  selector: 'app-api-key-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-key-dialog.component.html',
  styleUrls: ['./api-key-dialog.component.scss']
})
export class ApiKeyDialogComponent implements OnInit {
  apiKey = '';
  isOpen = false;
  showKey = false;

  constructor(private transcriptionService: TranscriptionService) {}

  ngOnInit(): void {
    console.log('[ApiKeyDialog] Component initialized');
    this.checkApiKey();
  }

  checkApiKey(): void {
    const hasApiKey = this.transcriptionService.isApiKeySet();
    console.log('[ApiKeyDialog] Checking API key...', { apiKeySet: hasApiKey });

    if (!hasApiKey) {
      console.log('[ApiKeyDialog] No API key found - showing dialog');
      this.isOpen = true;
    } else {
      console.log('[ApiKeyDialog] ✓ API key is already set');
      this.isOpen = false;
    }
  }

  saveApiKey(): void {
    if (this.apiKey.trim()) {
      console.log('[ApiKeyDialog] Saving API key...', {
        keyLength: this.apiKey.length,
        keyPrefix: this.apiKey.substring(0, 10)
      });

      this.transcriptionService.setElevenLabsApiKey(this.apiKey.trim());
      this.isOpen = false;

      console.log('[ApiKeyDialog] ✓ API key saved successfully');
    } else {
      console.warn('[ApiKeyDialog] ⚠️ Empty API key provided');
      alert('Please enter a valid API key');
    }
  }

  toggleShowKey(): void {
    this.showKey = !this.showKey;
  }

  closeDialog(): void {
    if (this.transcriptionService.isApiKeySet()) {
      this.isOpen = false;
    } else {
      alert('API key is required to use transcription feature');
    }
  }
}
