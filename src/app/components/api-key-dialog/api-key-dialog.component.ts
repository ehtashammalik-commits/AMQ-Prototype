import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranscriptionService } from '../../services/transcription.service';
import { UiEventsService } from '../../services/ui-events.service';

@Component({
  selector: 'app-api-key-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './api-key-dialog.component.html',
  styleUrls: ['./api-key-dialog.component.scss']
})
export class ApiKeyDialogComponent implements OnInit {
  transcriptionApiKey = '';
  openaiAnalysisApiKey = '';
  isOpen = false;
  showTranscriptionKey = false;
  showAnalysisKey = false;
  apiKeyTab: 'transcription' | 'analysis' = 'transcription';

  constructor(
    private transcriptionService: TranscriptionService,
    private uiEvents: UiEventsService
  ) {}

  ngOnInit(): void {
    console.log('[ApiKeyDialog] Component initialized');
    this.uiEvents.openApiKeyDialog$.subscribe(tab => {
      this.openDialog(tab);
    });
  }

  openDialog(tab: 'transcription' | 'analysis' = 'transcription'): void {
    console.log('[ApiKeyDialog] Opening dialog for tab:', tab);
    this.isOpen = true;
    this.apiKeyTab = tab;
  }

  saveTranscriptionApiKey(): void {
    if (this.transcriptionApiKey.trim()) {
      console.log('[ApiKeyDialog] Saving transcription API key...');
      this.transcriptionService.setElevenLabsApiKey(this.transcriptionApiKey.trim());
      this.transcriptionApiKey = '';
      alert('Transcription API key saved successfully!');
    } else {
      alert('Please enter a valid transcription API key');
    }
  }

  saveAnalysisApiKey(): void {
    if (this.openaiAnalysisApiKey.trim()) {
      console.log('[ApiKeyDialog] Saving OpenAI analysis API key...');
      this.transcriptionService.setOpenAIApiKey(this.openaiAnalysisApiKey.trim());
      this.openaiAnalysisApiKey = '';
      alert('OpenAI API key saved successfully! QM analysis will now use LLM.');
    } else {
      alert('Please enter a valid OpenAI API key');
    }
  }

  closeDialog(): void {
    if (this.transcriptionService.isApiKeySet()) {
      this.isOpen = false;
    } else {
      alert('API key is required to use transcription feature');
    }
  }
}
