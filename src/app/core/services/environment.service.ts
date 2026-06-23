/**
 * Environment configuration service
 * Loads environment variables from .env file (development)
 * or process.env (production/CI)
 */

export const getEnvironmentConfig = () => {
  const isDevelopment = !isProd();

  return {
    production: isProd(),
    apiUrl: getEnvVariable('NG_APP_API_URL', 'https://dummyjson.com'),
    apiTimeout: parseInt(getEnvVariable('NG_APP_API_TIMEOUT', '30000'), 10),
    environment: getEnvVariable('NG_APP_ENVIRONMENT', isDevelopment ? 'development' : 'production'),
    debug: getEnvVariable('NG_APP_DEBUG', isDevelopment ? 'true' : 'false') === 'true',
    enableAnalytics: getEnvVariable('NG_APP_ENABLE_ANALYTICS', 'false') === 'true',
    enableSentry: getEnvVariable('NG_APP_ENABLE_SENTRY', 'false') === 'true',
  };
};

/**
 * Get environment variable with fallback
 */
function getEnvVariable(key: string, defaultValue: string = ''): string {
  // In Angular, env vars are prefixed with NG_APP_ and available globally
  // For client-side apps, they're embedded during build
  return (window as any).__ENV__?.[key] || defaultValue;
}

/**
 * Check if production environment
 */
function isProd(): boolean {
  return window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
}
