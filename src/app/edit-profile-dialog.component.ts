import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from './services/user.service';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="edit-profile-dialog">
      <div class="dialog-header">
        <h2>Edit Profile</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <form [formGroup]="profileForm" class="profile-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Job Title</mat-label>
          <input matInput formControlName="jobTitle">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <input matInput formControlName="department">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location">
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Bio</mat-label>
          <textarea matInput formControlName="bio" rows="3"></textarea>
        </mat-form-field>
      </form>
      
      <div class="dialog-actions">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" (click)="saveProfile()" [disabled]="profileForm.invalid">
          Save Changes
        </button>
      </div>
    </div>
  `,
  styles: [`
    .edit-profile-dialog {
      width: 100%;
      max-width: 700px;
      min-width: min(700px, 90vw);
      padding: 0;
      background: var(--surface-color);
      color: var(--text-primary);
      
      @media (max-width: 768px) {
        min-width: 95vw;
        max-width: 95vw;
      }
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
      
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
      }

      button {
        color: var(--text-secondary);
      }
    }
    
    .profile-form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .dialog-actions {
      padding: 16px 20px;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 8px;

      button[mat-button] {
        color: var(--text-secondary);
      }
    }
  `]
})
export class EditProfileDialogComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.profileForm = this.fb.group({
      name: [data.name, Validators.required],
      jobTitle: [data.jobTitle, Validators.required],
      department: [data.department, Validators.required],
      email: [data.email, [Validators.required, Validators.email]],
      phone: [data.phone],
      location: [data.location],
      bio: [data.bio]
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.dialogRef.close(this.profileForm.value);
    }
  }
}