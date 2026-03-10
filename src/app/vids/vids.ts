import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DummyDataService } from '../services/dummy-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vids',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './vids.html',
  styleUrl: './vids.scss',
})
export class VidsComponent {
  videos;
  constructor(private dummyService: DummyDataService) {
    this.videos = this.dummyService.videos;
    this.dummyService.fetchVideos();
  }
}
