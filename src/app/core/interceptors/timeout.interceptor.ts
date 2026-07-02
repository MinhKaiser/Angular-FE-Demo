import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';
import { getEnvironmentConfig } from '@core/services/environment.service';

export const timeoutInterceptor: HttpInterceptorFn = (request, next) => {
  const { apiTimeout } = getEnvironmentConfig();
  return next(request).pipe(timeout(apiTimeout));
};
