import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  name: string;
  jobTitle: string;
  department: string;
  profilePicture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'connectify_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock login for demo - accepts any email/password
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        jobTitle: 'Software Developer',
        department: 'Engineering'
      }
    };

    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        localStorage.setItem(this.TOKEN_KEY, mockResponse.token);
        this.currentUserSubject.next(mockResponse.user);
        this.isAuthenticated.set(true);
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticated.set(true);
    }
  }
}