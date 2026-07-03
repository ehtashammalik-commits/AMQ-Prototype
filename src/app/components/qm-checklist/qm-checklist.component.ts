import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { QmComplianceService } from '../../services/qm-compliance.service';
import { QMComplianceReport } from '../../models/qm-compliance.model';
import { AudioCall, Message } from '../../models/audio-call.model';

@Component({
  selector: 'app-qm-checklist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qm-checklist.component.html',
  styleUrls: ['./qm-checklist.component.scss']
})
export class QmChecklistComponent implements OnInit {
  complianceReport: QMComplianceReport | null = null;
  isLoading = false;
  selectedAudioCall: any = null;
  private previousAudioCallId: string | null = null;

  constructor(
    private audioService: AudioService,
    private qmComplianceService: QmComplianceService
  ) {}

  ngOnInit(): void {
    console.log('[QMChecklist] Component initialized');

    this.audioService.selectedAudioCall$.subscribe(selectedAudioCall => {
      // Clear analysis whenever file selection changes
      if (selectedAudioCall?.id !== this.previousAudioCallId) {
        console.log('[QMChecklist] Audio file changed, clearing analysis');
        this.complianceReport = null;
        this.previousAudioCallId = selectedAudioCall?.id || null;
      }

      this.selectedAudioCall = selectedAudioCall;
    });
  }

  generateAnalysis(): void {
    if (!this.selectedAudioCall) {
      alert('Please select an audio file first');
      return;
    }

    console.log('[QMChecklist] Generate Analysis clicked for:', { audioId: this.selectedAudioCall.id });

    // Get the transcription from the conversation messages
    const conversation = this.audioService.getConversation();
    console.log('[QMChecklist] All messages:', conversation.messages.length);
    console.log('[QMChecklist] Looking for audio:', this.selectedAudioCall.id);

    const transcriptionSegments = conversation.messages
      .filter(msg => {
        const isTranscription = msg.type === 'transcription';
        const isThisAudio = msg.audioCall?.id === this.selectedAudioCall.id;
        return isTranscription && isThisAudio;
      })
      .map((msg, index) => ({
        speaker: msg.speaker || 'unknown',
        text: msg.content || '',
        startTime: msg.segmentStartTime !== undefined ? msg.segmentStartTime : index * 5,
        endTime: msg.segmentEndTime !== undefined ? msg.segmentEndTime : (index + 1) * 5,
        confidence: 0.95
      }));

    console.log('[QMChecklist] Found segments:', { count: transcriptionSegments.length });

    if (transcriptionSegments.length > 0) {
      const diarization = {
        fullText: transcriptionSegments.map(s => s.text).join(' '),
        segments: transcriptionSegments,
        duration: Math.max(...transcriptionSegments.map(s => s.endTime || 0)),
        language: 'ar',
        hasMultipleSpeakers: transcriptionSegments.some(s => s.speaker === 'agent') && transcriptionSegments.some(s => s.speaker === 'customer')
      };

      this.analyzeCompliance(diarization, this.selectedAudioCall.id);
    } else {
      alert('No transcription found for this audio file');
      this.complianceReport = null;
    }
  }

  private analyzeCompliance(transcription: any, audioId: string): void {
    this.isLoading = true;
    console.log('[QMChecklist] Analyzing compliance for audio:', audioId);

    this.qmComplianceService.analyzeTranscriptionWithLLM(transcription, audioId).subscribe({
      next: (report) => {
        this.complianceReport = report;
        this.isLoading = false;
        console.log('[QMChecklist] Analysis complete:', report);
      },
      error: (error) => {
        console.error('[QMChecklist] Error analyzing compliance:', error);
        alert(`Analysis failed: ${error.message}`);
        this.isLoading = false;
      }
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pass':
        return '✓';
      case 'fail':
        return '✗';
      default:
        return '?';
    }
  }

  getConfidencePercentage(confidence: number): number {
    return Math.round(confidence * 100);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }
}
