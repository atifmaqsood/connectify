import { Component, Input, signal } from '@angular/core';
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
  @Input() type: 'left' | 'right' = 'left';

  onlineColleagues = signal([
    { id: '1', name: 'Alice Smith' },
    { id: '2', name: 'Bob Wilson' },
    { id: '3', name: 'Carol Brown' },
    { id: '4', name: 'David Lee' },
    { id: '5', name: 'Emma Davis' },
    { id: '6', name: 'Frank Miller' }
  ]);

  leftActions = signal([
    { icon: 'person', label: 'Friends', color: '#1877f2' },
    { icon: 'history', label: 'Memories', color: '#1877f2' },
    { icon: 'bookmark', label: 'Saved', color: '#9d76f1' },
    { icon: 'groups', label: 'Groups', color: '#1877f2' },
    { icon: 'storefront', label: 'Marketplace', color: '#1877f2' },
    { icon: 'ondemand_video', label: 'Watch', color: '#1877f2' },
    { icon: 'event', label: 'Events', color: '#f35e59' }
  ]);

  rightSponsored = signal([
    {
      image: 'https://picsum.photos/seed/ads1/300/150',
      title: 'Premium Gadgets 2026',
      link: 'gadgets.com'
    },
    {
      image: 'https://picsum.photos/seed/ads2/300/150',
      title: 'Cloud Solutions Inc.',
      link: 'cloud.io'
    }
  ]);
}