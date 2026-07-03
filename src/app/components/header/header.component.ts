import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiEventsService } from '../../services/ui-events.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentDate = new Date();
  userName = 'Admin';

  constructor(private uiEvents: UiEventsService) {}

  openApiKeyDialog(): void {
    this.uiEvents.openApiKeyDialog('transcription');
  }
}
