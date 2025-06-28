import Config from 'react-native-config';
import { Env } from './env.types';

/**
 * Check if a specific environment variable exists
 */
export const hasEnvVar = (key: keyof Env): boolean => {
  return Config[key] !== undefined && Config[key] !== null && Config[key] !== '';
};

/**
 * Parsed and typed environment variables
 */
const env: Env = {
  API_URL: Config.API_URL || 'https://api.example.com',
  API_KEY: Config.API_KEY || '',
  APP_ENV: (Config.APP_ENV as Env['APP_ENV']) || 'development',
  DEBUG: Config.DEBUG === 'true',
  TIMEOUT: Number(Config.TIMEOUT) || 5000,
  GOOGLE_MAPS_API_KEY: Config.GOOGLE_MAPS_API_KEY || 'your_google_maps_api_key_here',
};

// Log warning in development environment when variables are missing
if (__DEV__) {
  const missingVars = Object.keys(env).filter((key) => !hasEnvVar(key as keyof Env));
  if (missingVars.length > 0) {
    console.warn(`[Environment] Missing environment variables: ${missingVars.join(', ')}. Using default values.`);
  }
}

/**
 * Helper function to check if we're in production environment
 */
export const isProduction = (): boolean => env.APP_ENV === 'production';

/**
 * Helper function to check if we're in staging environment
 */
export const isStaging = (): boolean => env.APP_ENV === 'staging';

/**
 * Helper function to check if we're in development environment
 */
export const isDevelopment = (): boolean => env.APP_ENV === 'development';

/**
 * Helper function to check if debug mode is enabled
 */
export const isDebugEnabled = (): boolean => env.DEBUG;

export default env;
