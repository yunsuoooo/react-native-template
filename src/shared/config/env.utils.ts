import Config from 'react-native-config';
import { Env } from './env.types';

/**
 * Check if required environment variables are missing
 * @returns Array of missing environment variable keys
 */
export const getMissingEnvVars = (): string[] => {
  const requiredVars: Array<keyof Env> = [
    'API_URL',
    'API_KEY',
    'APP_ENV',
    // Add any other required variables here
  ];

  return requiredVars.filter((key) => !Config[key]);
};

/**
 * Validate if all required environment variables are present
 * @returns Boolean indicating if all required variables are present
 */
export const validateEnv = (): boolean => {
  const missing = getMissingEnvVars();
  return missing.length === 0;
};

/**
 * Get a descriptive message about missing environment variables
 * @returns Error message with list of missing variables
 */
export const getMissingEnvVarsMessage = (): string => {
  const missing = getMissingEnvVars();

  if (missing.length === 0) {
    return 'All required environment variables are set.';
  }

  return `Missing required environment variables: ${missing.join(', ')}. Please check your .env file.`;
};

/**
 * Get environment variable value with fallback
 * @param key Environment variable key
 * @param fallback Fallback value if key is not found
 * @returns Environment variable value or fallback
 */
export const getEnv = (key: string, fallback: string = ''): string => {
  return Config[key] || fallback;
};
