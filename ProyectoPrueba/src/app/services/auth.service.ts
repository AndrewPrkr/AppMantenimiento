import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User } from '../models/user.model';
import { StorageService } from './storage.service';

const AUTH_API = 'http://localhost:3000/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // Check if user is already logged in
    if (this.storageService.isLoggedIn()) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(this.storageService.getUser());
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(AUTH_API + 'signin', credentials, httpOptions)
      .pipe(
        tap(response => {
          this.storageService.saveToken(response.accessToken);
          this.storageService.saveUser({
            id: response.id,
            employee_number: response.employee_number,
            full_name: response.full_name,
            role: response.role
          });
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(this.storageService.getUser());
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions)
      .pipe(
        tap(() => {
          this.storageService.clean();
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
        })
      );
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  getUserRole(): string | null {
    return this.storageService.getUserRole();
  }

  getCurrentUser(): User | null {
    return this.storageService.getUser();
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.includes(userRole || '');
  }
}