import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NavbarComponent } from '../navbar/navbar.component';
import { FeedComponent } from '../feed/feed.component';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { EditProfileDialogComponent } from '../edit-profile-dialog.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDividerModule,
    MatDialogModule,
    NavbarComponent,
    FeedComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user;
  stats = {
    posts: 42,
    followers: 156,
    following: 89
  };

  constructor(
    private userService: UserService,
    private postService: PostService,
    private dialog: MatDialog
  ) {
    this.user = this.userService.user;
  }

  editProfile(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: 'min(700px, 90vw)',
      maxWidth: '700px',
      data: this.user()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result);
      }
    });
  }

  onCoverPhotoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userService.updateCoverPhoto(file).then(() => {
        this.postService.addPost(`Updated cover photo`, file);
      });
    }
  }

  onProfilePhotoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userService.updateProfilePhoto(file).then(() => {
        this.postService.addPost(`Updated profile picture`, file);
      });
    }
  }

  triggerCoverUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => this.onCoverPhotoChange(e);
    input.click();
  }

  triggerProfileUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => this.onProfilePhotoChange(e);
    input.click();
  }
}