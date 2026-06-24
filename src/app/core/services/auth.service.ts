import { computed, Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  AuthState,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  UserSummary,
} from '@shared/models';
import { getEnvironmentConfig } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = getEnvironmentConfig();
  private readonly baseUrl = this.config.apiUrl;
  private readonly storageKeys = {
    accessToken: 'dummyjson_access_token',
    refreshToken: 'dummyjson_refresh_token',
    user: 'dummyjson_user',
  };

  private readonly authState = signal<AuthState>(this.createInitialState());

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly error = computed(() => this.authState().error);
  readonly displayName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authState.update(state => ({ ...state, isLoading: true, error: null }));

    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials, {
      withCredentials: true,
    }).pipe(
      tap(response => {
        this.setSession(response, response.accessToken, response.refreshToken);
      }),
      catchError(error => {
        this.authState.update(state => ({
          ...state,
          isLoading: false,
          error: this.getErrorMessage(error, 'Login failed'),
        }));

        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearSession();
  }

  getCurrentUser(): Observable<User> {
    const token = this.getAccessToken();

    if (!token) {
      return throwError(() => new Error('No access token available'));
    }

    return this.http.get<User>(`${this.baseUrl}/auth/me`, {
      withCredentials: true,
    }).pipe(
      tap(user => {
        this.saveUserToStorage(user);
        this.authState.update(state => ({
          ...state,
          user,
        }));
      }),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  refreshToken(expiresInMins?: number): Observable<RefreshTokenResponse> {
    const refreshTokenValue = this.getRefreshToken();
    const body: RefreshTokenRequest = {};

    if (refreshTokenValue) {
      body.refreshToken = refreshTokenValue;
    }

    if (expiresInMins) {
      body.expiresInMins = expiresInMins;
    }

    return this.http.post<RefreshTokenResponse>(`${this.baseUrl}/auth/refresh`, body, {
      withCredentials: true,
    }).pipe(
      tap(response => {
        this.saveTokensToStorage(response.accessToken, response.refreshToken);
        this.authState.update(state => ({
          ...state,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        }));
      }),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      })
    );
  }

  getAccessToken(): string | null {
    return this.authState().accessToken;
  }

  getRefreshToken(): string | null {
    return this.authState().refreshToken;
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    return this.isTokenValueExpired(token);
  }

  clearSession(): void {
    this.removeStoredAuth();
    this.authState.set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }

  private createInitialState(): AuthState {
    const accessToken = this.loadTokenFromStorage();
    const refreshToken = this.loadRefreshTokenFromStorage();

    if (!accessToken || this.isTokenValueExpired(accessToken)) {
      this.removeStoredAuth();
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    }

    return {
      user: this.loadUserFromStorage(),
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken,
      isLoading: false,
      error: null,
    };
  }

  private setSession(user: UserSummary, accessToken: string, refreshToken: string): void {
    this.saveTokensToStorage(accessToken, refreshToken);
    this.saveUserToStorage(user);
    this.authState.set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.storageKeys.accessToken, accessToken);
    localStorage.setItem(this.storageKeys.refreshToken, refreshToken);
  }

  private saveUserToStorage(user: UserSummary): void {
    localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
  }

  private loadTokenFromStorage(): string | null {
    try {
      return localStorage.getItem(this.storageKeys.accessToken);
    } catch {
      return null;
    }
  }

  private loadRefreshTokenFromStorage(): string | null {
    try {
      return localStorage.getItem(this.storageKeys.refreshToken);
    } catch {
      return null;
    }
  }

  private loadUserFromStorage(): UserSummary | null {
    try {
      const user = localStorage.getItem(this.storageKeys.user);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  private removeStoredAuth(): void {
    try {
      localStorage.removeItem(this.storageKeys.accessToken);
      localStorage.removeItem(this.storageKeys.refreshToken);
      localStorage.removeItem(this.storageKeys.user);
    } catch {
      return;
    }
  }

  private normalizeBase64Url(value: string): string {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    return base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  }

  private isTokenValueExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(this.normalizeBase64Url(token.split('.')[1])));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String(error.message);
    }

    return fallback;
  }
}
