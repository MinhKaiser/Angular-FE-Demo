import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, LoginResponse, AuthState } from '@shared/models';
import { getEnvironmentConfig } from './environment.service';

/**
 * Dịch vụ xác thực
 * Quản lý đăng nhập, token và phiên làm việc
 * Sử dụng API DummyJSON: https://dummyjson.com/docs/auth
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly config = getEnvironmentConfig();
  private readonly baseUrl = this.config.apiUrl;

  private readonly authState = signal<AuthState>({
    user: this.loadUserFromStorage(),
    accessToken: this.loadTokenFromStorage(),
    refreshToken: this.loadRefreshTokenFromStorage(),
    isAuthenticated: !!this.loadTokenFromStorage(),
    isLoading: false,
    error: null,
  });

  // Các computed signal cho trạng thái phản ứng
  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isLoading = computed(() => this.authState().isLoading);
  readonly error = computed(() => this.authState().error);

  constructor(private http: HttpClient) {
    this.checkTokenValidity();
  }

  // Đăng nhập với thông tin đăng nhập (POST /auth/login)
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.authState.update(state => ({ ...state, isLoading: true, error: null }));

    return this.http.post<LoginResponse>(
      `${this.baseUrl}/auth/login`,
      credentials,
      { withCredentials: true } // Include cookies for credential handling
    ).pipe(
      tap(response => {
        const { accessToken, refreshToken, ...user } = response;
        this.saveTokensToStorage(accessToken, refreshToken);
        this.saveUserToStorage(user as User);
        this.authState.update(state => ({
          ...state,
          user: user as User,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      }),
      catchError(error => {
        const errorMsg = error.error?.message || error.statusText || 'Login failed';
        this.authState.update(state => ({
          ...state,
          isLoading: false,
          error: errorMsg,
        }));
        throw error;
      })
    );
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => this.clearAuthState()),
      catchError(error => {
        this.clearAuthState();
        return of(void 0);
      })
    );
  }

  /**
   * Get current authenticated user info
   * GET /auth/me
   */
  getCurrentUser(): Observable<User> {
    const token = this.loadTokenFromStorage();
    if (!token) {
      throw new Error('No access token available');
    }

    return this.http.get<User>(
      `${this.baseUrl}/auth/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      }
    ).pipe(
      tap(user => {
        this.saveUserToStorage(user);
        this.authState.update(state => ({
          ...state,
          user,
        }));
      }),
      catchError(error => {
        this.clearAuthState();
        throw error;
      })
    );
  }

  /**
   * Refresh authentication tokens
   * POST /auth/refresh
   * Extends session and creates new access token
   */
  refreshToken(expiresInMins?: number): Observable<{ accessToken: string; refreshToken: string }> {
    const refreshTokenValue = this.loadRefreshTokenFromStorage();

    const body: any = {};
    if (refreshTokenValue) {
      body.refreshToken = refreshTokenValue;
    }
    if (expiresInMins) {
      body.expiresInMins = expiresInMins;
    }

    return this.http.post<{ accessToken: string; refreshToken: string }>(
      `${this.baseUrl}/auth/refresh`,
      body,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.saveTokensToStorage(response.accessToken, response.refreshToken);
        this.authState.update(state => ({
          ...state,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }));
      }),
      catchError(error => {
        this.clearAuthState();
        throw error;
      })
    );
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.loadTokenFromStorage();
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.loadRefreshTokenFromStorage();
  }

  /**
   * Check if current access token is expired
   */
  isTokenExpired(): boolean {
    const token = this.loadTokenFromStorage();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime;
    } catch {
      return true;
    }
  }

  /**
   * Private helpers
   */
  private checkTokenValidity(): void {
    const token = this.loadTokenFromStorage();
    if (token && this.isTokenExpired()) {
      this.clearAuthState();
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadTokenFromStorage(): string | null {
    try {
      return localStorage.getItem('accessToken');
    } catch {
      return null;
    }
  }

  private loadRefreshTokenFromStorage(): string | null {
    try {
      return localStorage.getItem('refreshToken');
    } catch {
      return null;
    }
  }

  private loadUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  private clearAuthState(): void {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch {
      // Ignore errors if localStorage is unavailable
    }

    this.authState.set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }
}
