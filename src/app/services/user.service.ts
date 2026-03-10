import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  coverPhoto: string;
  profilePhoto: string;
  bio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'connectify_user';
  
  user = signal<User>({
    id: '1',
    name: 'John Doe',
    jobTitle: 'Software Developer',
    department: 'Engineering',
    email: 'john.doe@nku.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'January 2022',
    coverPhoto: '/assets/cover-avatar.png',
    profilePhoto: '/assets/profile-avatar.png',
    bio: 'Passionate software developer with 5+ years of experience in web technologies.'
  });

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {
    const storedUser = localStorage.getItem(this.USER_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Update old placeholder URLs with asset paths
      if (user.profilePhoto === 'https://via.placeholder.com/200x200') {
        user.profilePhoto = '/assets/profile-avatar.png';
      }
      if (user.coverPhoto === 'https://via.placeholder.com/1200x400') {
        user.coverPhoto = '/assets/cover-avatar.png';
      }
      this.user.set(user);
      this.saveUser();
    } else {
      this.saveUser();
    }
  }

  private saveUser(): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(this.user()));
  }

  updateUser(updates: Partial<User>): void {
    this.user.set({ ...this.user(), ...updates });
    this.saveUser();
    // Trigger a storage event to notify other components
    window.dispatchEvent(new CustomEvent('userUpdated'));
  }

  updateProfilePhoto(file: File): Promise<void> {
    return this.convertImageToBase64(file).then(base64 => {
      this.updateUser({ profilePhoto: base64 });
    });
  }

  updateCoverPhoto(file: File): Promise<void> {
    return this.convertImageToBase64(file).then(base64 => {
      this.updateUser({ coverPhoto: base64 });
    });
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}