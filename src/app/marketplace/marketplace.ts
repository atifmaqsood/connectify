import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DummyDataService } from '../services/dummy-data.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.scss',
})
export class MarketplaceComponent {
  products;
  constructor(private dummyService: DummyDataService) {
    this.products = this.dummyService.products;
    this.dummyService.fetchMarketplace();
  }
}
