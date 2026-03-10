import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      jobTitle: ['', [Validators.required]],
      department: ['', [Validators.required]]
    });
  }

  togglePassword(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      // Mock signup - in real app, call signup API
      setTimeout(() => {
        const formData = this.signupForm.value;
        const mockUser = {
          id: Date.now().toString(),
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          jobTitle: formData.jobTitle,
          department: formData.department,
          profilePhoto: '/assets/profile-avatar.png',
          coverPhoto: '/assets/cover-avatar.png',
          phone: '',
          location: '',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bio: ''
        };

        // Store user data
        localStorage.setItem('connectify_user', JSON.stringify(mockUser));
        localStorage.setItem('connectify_token', 'mock-jwt-token-' + Date.now());

        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
  }
}