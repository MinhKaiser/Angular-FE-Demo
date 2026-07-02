import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject, of } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { RefreshTokenResponse } from '@shared/models';
import { authInterceptor } from './auth.interceptor';

class AuthServiceStub {
  readonly getAccessToken = vi.fn(() => 'access-token');
  readonly getRefreshToken = vi.fn(() => 'refresh-token');
  readonly clearSession = vi.fn();
  readonly refreshToken = vi.fn(
    (): Observable<RefreshTokenResponse> =>
      of({ accessToken: 'refreshed-access-token', refreshToken: 'refreshed-token' }),
  );
}

describe('authInterceptor', () => {
  let authService: AuthServiceStub;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    authService = new AuthServiceStub();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('attaches the access token only to API requests', () => {
    http.get('https://dummyjson.com/products').subscribe();
    http.get('https://example.com/profile').subscribe();

    const apiRequest = httpMock.expectOne('https://dummyjson.com/products');
    const externalRequest = httpMock.expectOne('https://example.com/profile');

    expect(apiRequest.request.headers.get('Authorization')).toBe('Bearer access-token');
    expect(externalRequest.request.headers.has('Authorization')).toBe(false);

    apiRequest.flush({});
    externalRequest.flush({});
  });

  it('does not attach the access token to public auth endpoints', () => {
    http.post('https://dummyjson.com/auth/login', {}).subscribe();
    http.post('https://dummyjson.com/auth/refresh', {}).subscribe();

    const loginRequest = httpMock.expectOne('https://dummyjson.com/auth/login');
    const refreshRequest = httpMock.expectOne('https://dummyjson.com/auth/refresh');

    expect(loginRequest.request.headers.has('Authorization')).toBe(false);
    expect(refreshRequest.request.headers.has('Authorization')).toBe(false);

    loginRequest.flush({});
    refreshRequest.flush({});
  });

  it('shares one token refresh across concurrent unauthorized requests', () => {
    const refreshResponse = new Subject<RefreshTokenResponse>();
    authService.refreshToken.mockReturnValue(refreshResponse);

    const responses: unknown[] = [];
    http.get('https://dummyjson.com/products').subscribe((response) => responses.push(response));
    http.get('https://dummyjson.com/posts').subscribe((response) => responses.push(response));

    const initialRequests = httpMock.match(
      (request) =>
        request.url === 'https://dummyjson.com/products' ||
        request.url === 'https://dummyjson.com/posts',
    );

    expect(initialRequests).toHaveLength(2);
    initialRequests.forEach((request) =>
      request.flush(null, { status: 401, statusText: 'Unauthorized' }),
    );

    expect(authService.refreshToken).toHaveBeenCalledTimes(1);

    refreshResponse.next({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    refreshResponse.complete();

    const retriedRequests = httpMock.match(
      (request) =>
        request.url === 'https://dummyjson.com/products' ||
        request.url === 'https://dummyjson.com/posts',
    );

    expect(retriedRequests).toHaveLength(2);
    retriedRequests.forEach((request) => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer new-access-token');
      request.flush({});
    });

    expect(responses).toHaveLength(2);
  });
});
