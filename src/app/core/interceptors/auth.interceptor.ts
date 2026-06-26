import { inject } from '@angular/core';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

const TOKEN_ATTACHED_PATHS = ['/auth/me'] as const;
const TOKEN_REFRESHABLE_PATHS = ['/auth/me'] as const;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);
let isRefreshingToken = false;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  const authRequest = accessToken && shouldAttachToken(request)
    ? addAuthorizationHeader(request, accessToken)
    : request;

  return next(authRequest).pipe(
    catchError(error => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        shouldRefreshSession(request) &&
        authService.getRefreshToken()
      ) {
        return handleUnauthorized(authRequest, next, authService);
      }

      return throwError(() => error);
    })
  );
};

function addAuthorizationHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handleUnauthorized(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshingToken) {
    isRefreshingToken = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(tokens => {
        isRefreshingToken = false;
        refreshTokenSubject.next(tokens.accessToken);
        return next(addAuthorizationHeader(request, tokens.accessToken));
      }),
      catchError(error => {
        isRefreshingToken = false;
        authService.clearSession();
        return throwError(() => error);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => !!token),
    take(1),
    switchMap(token => next(addAuthorizationHeader(request, token)))
  );
}

function shouldAttachToken(request: HttpRequest<unknown>): boolean {
  return matchesProtectedPath(request.url, TOKEN_ATTACHED_PATHS);
}

function shouldRefreshSession(request: HttpRequest<unknown>): boolean {
  return matchesProtectedPath(request.url, TOKEN_REFRESHABLE_PATHS);
}

function matchesProtectedPath(url: string, paths: readonly string[]): boolean {
  const normalizedPath = extractPathname(url);
  return paths.some(path => normalizedPath === path || normalizedPath.endsWith(path));
}

function extractPathname(url: string): string {
  try {
    return new URL(url, 'http://localhost').pathname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}
