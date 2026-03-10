import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  liked: boolean;
}

@Component({
  selector: 'app-create-post-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Create New Post</h2>
    <mat-dialog-content>
      <form [formGroup]="postForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>What's on your mind?</mat-label>
          <textarea matInput formControlName="content" rows="4" placeholder="Share your thoughts..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="createPost()" [disabled]="postForm.invalid">
        Post
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class CreatePostDialogComponent {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatePostDialogComponent>
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  createPost(): void {
    if (this.postForm.valid) {
      this.dialogRef.close(this.postForm.value.content);
    }
  }
}

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts = signal<Post[]>([
    {
      id: '1',
      author: 'John Doe',
      content: 'Excited to announce our new project launch! Great work team!',
      timestamp: new Date(),
      likes: 12,
      comments: 3,
      liked: false
    },
    {
      id: '2',
      author: 'Jane Smith',
      content: 'Looking forward to the upcoming team building event. Should be fun!',
      timestamp: new Date(Date.now() - 3600000),
      likes: 8,
      comments: 1,
      liked: true
    }
  ]);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openCreatePostDialog(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add new post logic here
      }
    });
  }

  toggleLike(post: Post): void {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    this.posts.set([...this.posts()]);
  }
}