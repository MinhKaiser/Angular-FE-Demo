import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DevDiagnosticsService } from '@core/services';
import { getEnvironmentConfig } from '../services/environment.service';

export interface ApiError {
  status: number;
  message: string;
  url: string | null;
  raw: unknown;
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const config = getEnvironmentConfig();
  const diagnostics = inject(DevDiagnosticsService);

  return next(request).pipe(
    catchError(error => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const apiError: ApiError = {
        status: error.status,
        message: extractErrorMessage(error),
        url: error.url,
        raw: error.error,
      };

      if (config.debug) {
        console.error('HTTP error', apiError);
        diagnostics.reportHttp(apiError);
      }

      return throwError(() => apiError);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  if (typeof error.error === 'string') {
    return error.error;
  }

  if (error.error && typeof error.error === 'object' && 'message' in error.error) {
    return String(error.error.message);
  }

  return error.statusText || 'Request failed';
}
