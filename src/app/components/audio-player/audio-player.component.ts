import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioCall } from '../../models/audio-call.model';
import { AudioService } from '../../services/audio.service';
import { TranscriptionService } from '../../services/transcription.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() audioCall!: AudioCall;
  @Output() playbackTimeUpdate = new EventEmitter<{ audioId: string; currentTime: number; duration: number }>();
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  isTranscribing = false;
  hasTranscription = false;

  constructor(
    private audioService: AudioService,
    private transcriptionService: TranscriptionService
  ) {}

  ngOnInit(): void {
    if (this.audioCall?.fileUrl) {
      // Duration will be loaded when audio metadata loads
    }
  }

  ngOnDestroy(): void {
    if (this.audioElement) {
      this.audioElement.nativeElement.pause();
    }
  }

  onLoadedMetadata(): void {
    if (this.audioElement) {
      this.duration = this.audioElement.nativeElement.duration;
    }
  }

  onTimeUpdate(): void {
    if (this.audioElement) {
      this.currentTime = this.audioElement.nativeElement.currentTime;
      // Emit every half second to reduce console spam
      if (Math.floor(this.currentTime * 2) !== Math.floor((this.currentTime - 0.5) * 2)) {
        console.log(`[AudioPlayer] Emitting playback time: ${this.currentTime.toFixed(2)}s / ${this.duration.toFixed(2)}s`);
      }
      this.playbackTimeUpdate.emit({
        audioId: this.audioCall.id,
        currentTime: this.currentTime,
        duration: this.duration
      });
    }
  }

  togglePlayPause(): void {
    if (!this.audioElement) return;

    const audio = this.audioElement.nativeElement;
    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
    } else {
      audio.play().catch(err => console.error('Playback error:', err));
      this.isPlaying = true;
    }
  }

  onAudioEnded(): void {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  transcribeAudio(): void {
    console.log('[AudioPlayer] Transcribe button clicked', { fileName: this.audioCall.fileName });

    if (!this.audioCall.file) {
      console.error('[AudioPlayer] ✗ No file available for transcription');
      return;
    }

    if (this.isTranscribing) {
      console.warn('[AudioPlayer] ⏳ Transcription already in progress');
      return;
    }

    console.log('[AudioPlayer] ⏳ Starting transcription...');
    this.isTranscribing = true;
    this.audioCall.isTranscribing = true;

    this.transcriptionService.transcribeAudioWithDiarization(this.audioCall.file, 'ar').subscribe({
      next: (diarization) => {
        console.log('[AudioPlayer] ✓ Transcription completed successfully', {
          segmentCount: diarization.segments.length,
          hasMultipleSpeakers: diarization.hasMultipleSpeakers,
          textLength: diarization.fullText.length
        });

        this.audioCall.diarizedTranscription = diarization;
        this.audioCall.transcription = diarization.fullText;
        this.hasTranscription = true;
        this.isTranscribing = false;
        this.audioCall.isTranscribing = false;

        // Add diarized transcription messages to conversation
        console.log('[AudioPlayer] ✓ Diarization complete. Segments:', {
          totalSegments: diarization.segments.length,
          segments: diarization.segments.map((s, i) => ({
            index: i,
            speaker: s.speaker,
            startTime: s.startTime,
            endTime: s.endTime,
            textLength: s.text.length
          }))
        });

        diarization.segments.forEach((segment, index) => {
          console.log(`[AudioPlayer] Adding segment ${index + 1}:`, {
            speaker: segment.speaker,
            textLength: segment.text.length,
            startTime: segment.startTime,
            endTime: segment.endTime
          });

          this.audioService.addMessageToConversation({
            id: `msg-${Date.now()}-${index}`,
            type: 'transcription',
            content: segment.text,
            audioCall: this.audioCall,
            speaker: segment.speaker,
            timestamp: new Date(),
            segmentStartTime: segment.startTime || 0,
            segmentEndTime: segment.endTime || 0
          });
        });

        // Update audio call
        this.audioService.updateAudioCall(this.audioCall);
      },
      error: (error) => {
        const errorMessage = typeof error === 'string' ? error : error?.message || JSON.stringify(error);

        console.error('[AudioPlayer] ✗ Transcription failed:', {
          errorMessage: errorMessage,
          errorStatus: error?.status,
          errorUrl: error?.url,
          fullError: error
        });

        this.isTranscribing = false;
        this.audioCall.isTranscribing = false;

        // Show detailed error to user
        const displayMessage = `Transcription Failed:\n\n${errorMessage}\n\nCheck browser console (F12) for more details.`;
        alert(displayMessage);
      }
    });
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
