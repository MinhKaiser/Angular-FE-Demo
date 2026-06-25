import { ErrorHandler, Injectable, inject } from '@angular/core';
import { DevDiagnosticsService } from './dev-diagnostics.service';
import { getEnvironmentConfig } from './environment.service';

@Injectable()
export class RuntimeErrorHandlerService implements ErrorHandler {
  private readonly config = getEnvironmentConfig();
  private readonly diagnostics = inject(DevDiagnosticsService);

  handleError(error: unknown): void {
    if (this.config.debug) {
      console.error(error);
    }

    this.diagnostics.reportRuntime(error);
  }
}
