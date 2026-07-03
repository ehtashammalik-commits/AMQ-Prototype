import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ApiKeyDialogComponent } from './components/api-key-dialog/api-key-dialog.component';
import { AudioService } from './services/audio.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    ConversationComponent,
    FileUploadComponent,
    ApiKeyDialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedConversation: any;

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Initialize
  }
}
