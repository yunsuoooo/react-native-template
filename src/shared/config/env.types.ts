/**
 * Environment variables type definitions
 */
export interface Env {
  API_URL: string;
  API_KEY: string;
  APP_ENV: 'development' | 'staging' | 'production';
  DEBUG: boolean;
  TIMEOUT: number;
  GOOGLE_MAPS_API_KEY: string;
}
