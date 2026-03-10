import { Component, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-post-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent {
  postForm: FormGroup;
  selectedImage = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isEdit = false;
  originalImage: string | null = null;
  imageRemoved = false;
  user;
  loading = signal(false);
  selectedFeeling = signal<string | null>(null);
  
  feelings = [
    { emoji: '😊', text: 'feeling happy' },
    { emoji: '🎉', text: 'feeling excited' },
    { emoji: '💪', text: 'feeling motivated' },
    { emoji: '🤔', text: 'feeling thoughtful' },
    { emoji: '😍', text: 'feeling loved' },
    { emoji: '🔥', text: 'feeling awesome' },
    { emoji: '✨', text: 'feeling blessed' },
    { emoji: '🚀', text: 'feeling productive' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {
    this.user = this.userService.user;
    this.isEdit = data?.isEdit || false;
    this.postForm = this.fb.group({
      content: [data?.post?.content || '']
    });
    
    if (this.isEdit && data.post.image) {
      this.originalImage = data.post.image;
      this.selectedImage.set(data.post.image);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage.set(null);
    this.selectedFile.set(null);
    if (this.isEdit) {
      this.imageRemoved = true;
    }
  }

  addFeeling(): void {
    // This will be handled by the menu selection
  }
  
  selectFeeling(feeling: any): void {
    this.selectedFeeling.set(`${feeling.emoji} ${feeling.text}`);
    const currentContent = this.postForm.get('content')?.value || '';
    const feelingText = ` ${feeling.emoji} ${feeling.text}`;
    this.postForm.patchValue({
      content: currentContent + feelingText
    });
  }

  submitPost(): void {
    if (this.postForm.get('content')?.value) {
      this.loading.set(true);
      
      setTimeout(() => {
        const result = {
          content: this.postForm.get('content')?.value,
          image: this.selectedFile(),
          imageRemoved: this.imageRemoved
        };
        
        this.loading.set(false);
        this.dialogRef.close(result);
      }, 1000);
    }
  }
}