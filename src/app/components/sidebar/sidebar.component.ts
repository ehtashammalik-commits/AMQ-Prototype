import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { icon: '📅', label: 'Business Calendar', id: 'calendar' },
    { icon: '📢', label: 'Channel Manager', id: 'channels' },
    { icon: '🔄', label: 'Routing Engine', id: 'routing' },
    { icon: '🤖', label: 'Bot Connectors', id: 'bots' },
    { icon: '👥', label: 'Teams', id: 'teams' },
    { icon: '💼', label: 'Agent Desk', id: 'agents' },
    { icon: '🔗', label: 'Quick Links', id: 'links' },
    { icon: '📋', label: 'Forms', id: 'forms' },
    { icon: '📢', label: 'Campaigns', id: 'campaigns' },
    { icon: '⭐', label: 'Quality Management', id: 'qm' },
    { icon: '⭐', label: 'Reviews', id: 'reviews' }
  ];

  activeMenu = 'qm';

  selectMenu(id: string): void {
    this.activeMenu = id;
  }
}
