import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  onlineColleagues = signal([
    { id: '1', name: 'Alice Smith' },
    { id: '2', name: 'Bob Wilson' },
    { id: '3', name: 'Carol Brown' },
    { id: '4', name: 'David Lee' }
  ]);

  quickActions = signal([
    { icon: 'group', label: 'Find Colleagues', action: 'findColleagues' },
    { icon: 'event', label: 'Company Events', action: 'events' },
    { icon: 'work', label: 'Projects', action: 'projects' },
    { icon: 'help', label: 'Help Center', action: 'help' }
  ]);
}