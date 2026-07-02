import { environment } from '@env/environment';

export interface EnvironmentConfig {
  production: boolean;
  apiUrl: string;
  apiTimeout: number;
  environmentName: 'development' | 'production';
  debug: boolean;
  demoCredentials: DemoCredentials | null;
}

export interface DemoCredentials {
  username: string;
  password: string;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    production: environment.production,
    apiUrl: normalizeBaseUrl(environment.apiUrl),
    apiTimeout: 30000,
    environmentName: environment.production ? 'production' : 'development',
    debug: !environment.production,
    demoCredentials: environment.demoCredentials,
  };
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}
