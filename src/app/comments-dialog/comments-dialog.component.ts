import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PostService } from '../services/post.service';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule
  ],
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.scss']
})
export class CommentsDialogComponent {
  commentForm: FormGroup;
  isImageFullscreen = signal(false);
  comments = computed(() => this.postService.getPostComments(this.data.id));

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CommentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postService: PostService,
    private dialog: MatDialog
  ) {
    this.commentForm = this.fb.group({
      text: ['']
    });
  }

  addComment(): void {
    const text = this.commentForm.get('text')?.value;
    if (text) {
      this.postService.addComment(this.data.id, text);
      this.commentForm.reset();
    }
  }

  toggleCommentLike(comment: any): void {
    this.postService.toggleCommentLike(this.data.id, comment.id);
  }

  toggleReply(commentId: string): void {
    this.postService.toggleReply(this.data.id, commentId);
  }

  addReply(commentId: string, replyText: string): void {
    if (replyText && replyText.trim()) {
      this.postService.addReply(this.data.id, commentId, replyText.trim());
    }
  }

  toggleImageFullscreen(): void {
    this.isImageFullscreen.set(!this.isImageFullscreen());
  }

  closeFullscreen(): void {
    this.isImageFullscreen.set(false);
  }

  editPost(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: 'min(700px, 90vw)',
      maxWidth: '700px',
      panelClass: 'create-post-dialog',
      data: { isEdit: true, post: this.data }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updates: any = { content: result.content };
        if (result.image) {
          this.postService.updatePostWithImage(this.data.id, result.content, result.image);
        } else {
          updates.image = result.imageRemoved ? null : this.data.image;
          this.postService.updatePost(this.data.id, updates);
        }
      }
    });
  }

  deletePost(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.data.id);
      this.dialogRef.close();
    }
  }

  getCurrentUserInitials(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('connectify_user')) {
      const user = JSON.parse(localStorage.getItem('connectify_user')!);
      const names = user.name.split(' ');
      return names[0].charAt(0) + (names[1]?.charAt(0) || '');
    }
    return 'JD';
  }

  getCurrentUserName(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('connectify_user')) {
      const user = JSON.parse(localStorage.getItem('connectify_user')!);
      return user.name;
    }
    return 'John Doe';
  }

  getCurrentUserPhoto(): string {
    if (typeof window !== 'undefined' && localStorage.getItem('connectify_user')) {
      const user = JSON.parse(localStorage.getItem('connectify_user')!);
      return user.profilePhoto;
    }
    return 'https://via.placeholder.com/40x40';
  }

  togglePostLike(): void {
    this.postService.toggleLike(this.data.id);
  }
}