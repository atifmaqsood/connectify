import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
  posts;
  user;
  loadingPosts = signal<Set<string>>(new Set());

  constructor(
    private dialog: MatDialog,
    private postService: PostService,
    private userService: UserService
  ) {
    this.posts = this.postService.posts;
    this.user = this.userService.user;
  }

  openCreatePost(): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: 'min(700px, 90vw)',
      maxWidth: '700px',
      panelClass: 'create-post-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.addPost(result.content, result.image);
      }
    });
  }

  toggleLike(post: any): void {
    const currentLoading = this.loadingPosts();
    currentLoading.add(post.id);
    this.loadingPosts.set(new Set(currentLoading));
    
    setTimeout(() => {
      this.postService.toggleLike(post.id);
      const updatedLoading = this.loadingPosts();
      updatedLoading.delete(post.id);
      this.loadingPosts.set(new Set(updatedLoading));
    }, 500);
  }

  openComments(post: any): void {
    this.dialog.open(CommentsDialogComponent, {
      width: 'min(700px, 90vw)',
      maxWidth: '700px',
      height: '80vh',
      maxHeight: '80vh',
      data: post,
      panelClass: 'comments-dialog'
    });
  }

  editPost(post: any): void {
    const dialogRef = this.dialog.open(CreatePostDialogComponent, {
      width: 'min(700px, 90vw)',
      maxWidth: '700px',
      panelClass: 'create-post-dialog',
      data: { isEdit: true, post }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updates: any = { content: result.content };
        if (result.image) {
          this.postService.updatePostWithImage(post.id, result.content, result.image);
        } else {
          updates.image = result.imageRemoved ? null : post.image;
          this.postService.updatePost(post.id, updates);
        }
      }
    });
  }

  deletePost(post: any): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(post.id);
    }
  }
}