import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AudioCall, Message, Conversation } from '../models/audio-call.model';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioCallsSubject = new BehaviorSubject<AudioCall[]>([]);
  public audioCalls$ = this.audioCallsSubject.asObservable();

  private conversationSubject = new BehaviorSubject<Conversation>({
    id: 'conv-1',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  public conversation$ = this.conversationSubject.asObservable();

  private selectedAudioCallSubject = new BehaviorSubject<AudioCall | null>(null);
  public selectedAudioCall$ = this.selectedAudioCallSubject.asObservable();

  constructor() {
    this.loadAudioCallsFromStorage();
  }

  uploadAudioFile(file: File): AudioCall {
    const audioCall: AudioCall = {
      id: `call-${Date.now()}`,
      fileName: file.name,
      file: file,
      uploadedAt: new Date(),
      duration: 0,
      isTranscribing: false,
      language: 'ar'
    };

    // Create object URL for playback
    audioCall.fileUrl = URL.createObjectURL(file);

    // Add to list
    const currentCalls = this.audioCallsSubject.value;
    this.audioCallsSubject.next([...currentCalls, audioCall]);

    // Add to conversation
    this.addMessageToConversation({
      id: `msg-${Date.now()}`,
      type: 'audio',
      audioCall: audioCall,
      timestamp: new Date()
    });

    // Save to storage
    this.saveAudioCallsToStorage();

    return audioCall;
  }

  getAudioCall(id: string): AudioCall | undefined {
    return this.audioCallsSubject.value.find(call => call.id === id);
  }

  selectAudioCall(audioCall: AudioCall | null): void {
    this.selectedAudioCallSubject.next(audioCall);
    console.log('[AudioService] Audio selected:', audioCall?.id);
  }

  getSelectedAudioCall(): AudioCall | null {
    return this.selectedAudioCallSubject.value;
  }

  updateAudioCall(audioCall: AudioCall): void {
    const calls = this.audioCallsSubject.value.map(call =>
      call.id === audioCall.id ? audioCall : call
    );
    this.audioCallsSubject.next(calls);
    this.saveAudioCallsToStorage();
  }

  addMessageToConversation(message: Message): void {
    const conversation = this.conversationSubject.value;
    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    this.conversationSubject.next({ ...conversation });
  }

  getConversation(): Conversation {
    return this.conversationSubject.value;
  }

  private saveAudioCallsToStorage(): void {
    const calls = this.audioCallsSubject.value.map(call => ({
      ...call,
      file: undefined,
      fileUrl: call.fileUrl
    }));
    localStorage.setItem('audioCalls', JSON.stringify(calls));
  }

  private loadAudioCallsFromStorage(): void {
    const stored = localStorage.getItem('audioCalls');
    if (stored) {
      try {
        const calls = JSON.parse(stored);
        this.audioCallsSubject.next(calls);
      } catch (e) {
        console.error('Error loading audio calls from storage', e);
      }
    }
  }

  clearAll(): void {
    this.audioCallsSubject.next([]);
    this.conversationSubject.next({
      id: 'conv-1',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    localStorage.removeItem('audioCalls');
  }
}
