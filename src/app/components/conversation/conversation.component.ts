import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { QmChecklistComponent } from '../qm-checklist/qm-checklist.component';
import { Conversation, Message } from '../../models/audio-call.model';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, AudioPlayerComponent, QmChecklistComponent],
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChildren('transcriptionSegment') transcriptionSegments!: QueryList<ElementRef>;

  conversation: Conversation | null = null;
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  currentlyPlayingSegmentIndex: number = -1;
  currentAudioId: string = '';
  selectedAudioId: string | null = null;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    this.audioService.conversation$.subscribe(conv => {
      this.conversation = conv;
      this.messages = conv.messages;
      this.updateFilteredMessages();
      this.scrollToBottom();
    });

    this.audioService.selectedAudioCall$.subscribe(audioCall => {
      this.selectedAudioId = audioCall?.id || null;
      this.updateFilteredMessages();
      this.scrollToBottom();
    });
  }

  private updateFilteredMessages(): void {
    if (!this.selectedAudioId) {
      this.filteredMessages = [];
      console.log('[Conversation] No audio selected');
      return;
    }

    this.filteredMessages = this.messages.filter(msg => {
      if (msg.type === 'audio') {
        return msg.audioCall?.id === this.selectedAudioId;
      }
      if (msg.type === 'transcription') {
        return msg.audioCall?.id === this.selectedAudioId;
      }
      return false;
    });

    console.log('[Conversation] Filtered messages:', {
      selectedAudioId: this.selectedAudioId,
      totalMessages: this.messages.length,
      filteredMessages: this.filteredMessages.length
    });
  }

  onPlaybackTimeUpdate(event: { audioId: string; currentTime: number; duration: number }): void {
    this.currentAudioId = event.audioId;
    this.currentlyPlayingSegmentIndex = -1;

    console.log('[Conversation] Received playback update:', {
      audioId: event.audioId,
      currentTime: event.currentTime.toFixed(2),
      messageCount: this.messages.length,
      transcriptionMessages: this.messages.filter(m => m.type === 'transcription').length
    });

    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];
      if (message.type === 'transcription' && message.audioCall?.id === event.audioId) {
        const startTime = message.segmentStartTime || 0;
        const endTime = message.segmentEndTime || 0;

        if (event.currentTime >= startTime && event.currentTime < endTime) {
          this.currentlyPlayingSegmentIndex = i;
          console.log('[Conversation] ✓ Highlighting segment:', {
            messageIndex: i,
            currentTime: event.currentTime.toFixed(2),
            startTime: startTime.toFixed(2),
            endTime: endTime.toFixed(2),
            content: message.content?.substring(0, 50)
          });
          break;
        }
      }
    }
  }

  isSegmentPlaying(messageIndex: number): boolean {
    return messageIndex === this.currentlyPlayingSegmentIndex;
  }

  getDisplayTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
