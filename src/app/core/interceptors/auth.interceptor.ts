import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { getEnvironmentConfig } from '@core/services/environment.service';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/refresh'] as const;
let refreshRequest$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const { apiUrl } = getEnvironmentConfig();
  const accessToken = authService.getAccessToken();
  const authRequest =
    accessToken && shouldAttachToken(request, apiUrl)
      ? addAuthorizationHeader(request, accessToken)
      : request;

  return next(authRequest).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        shouldRefreshSession(request, apiUrl) &&
        authService.getRefreshToken()
      ) {
        return handleUnauthorized(authRequest, next, authService);
      }

      return throwError(() => error);
    }),
  );
};

function addAuthorizationHeader(
  request: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handleUnauthorized(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): Observable<HttpEvent<unknown>> {
  return getRefreshedAccessToken(authService).pipe(
    switchMap((token) => next(addAuthorizationHeader(request, token))),
  );
}

function getRefreshedAccessToken(authService: AuthService): Observable<string> {
  if (!refreshRequest$) {
    refreshRequest$ = authService.refreshToken().pipe(
      map((tokens) => tokens.accessToken),
      catchError((error) => {
        authService.clearSession();
        return throwError(() => error);
      }),
      finalize(() => {
        refreshRequest$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  return refreshRequest$;
}

function shouldAttachToken(request: HttpRequest<unknown>, apiUrl: string): boolean {
  return isApiRequest(request.url, apiUrl) && !matchesPath(request.url, PUBLIC_AUTH_PATHS);
}

function shouldRefreshSession(request: HttpRequest<unknown>, apiUrl: string): boolean {
  return isApiRequest(request.url, apiUrl) && !matchesPath(request.url, PUBLIC_AUTH_PATHS);
}

function matchesPath(url: string, paths: readonly string[]): boolean {
  const normalizedPath = extractPathname(url);
  return paths.some((path) => normalizedPath === path || normalizedPath.endsWith(path));
}

function isApiRequest(url: string, apiUrl: string): boolean {
  return url === apiUrl || url.startsWith(`${apiUrl}/`);
}

function extractPathname(url: string): string {
  try {
    return new URL(url, 'http://localhost').pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
