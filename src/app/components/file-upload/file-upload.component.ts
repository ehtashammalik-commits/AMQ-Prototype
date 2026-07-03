import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { AudioCall } from '../../models/audio-call.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  isDragging = false;
  uploadedFiles: File[] = [];
  audioCalls$: Observable<AudioCall[]>;
  selectedAudioId: string | null = null;

  constructor(private audioService: AudioService) {
    this.audioCalls$ = this.audioService.audioCalls$;
  }

  ngOnInit(): void {
    this.audioService.selectedAudioCall$.subscribe(audioCall => {
      this.selectedAudioId = audioCall?.id || null;
    });
  }

  selectAudio(audioCall: AudioCall): void {
    this.audioService.selectAudioCall(audioCall);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      if (this.isAudioFile(file)) {
        this.uploadedFiles.push(file);
        this.audioService.uploadAudioFile(file);
      } else {
        alert(`File ${file.name} is not a valid audio file. Please upload MP3, WAV, or M4A files.`);
      }
    });

    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private isAudioFile(file: File): boolean {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg'];
    const validExtensions = ['.mp3', '.wav', '.m4a', '.webm', '.ogg'];

    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    return hasValidType || hasValidExtension;
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}
