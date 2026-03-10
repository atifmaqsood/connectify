import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-gaming',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './gaming.html',
  styleUrl: './gaming.scss',
})
export class GamingComponent {

}
