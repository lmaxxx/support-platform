/**
 * Environment variable validation utilities
 * Ensures required environment variables are present at runtime
 */

export function requireEnv(key: string): string {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please ensure ${key} is set in your .env.local file.`
    );
  }

  return value;
}

export function getEnv(key: string, defaultValue: string): string {
  const value = process.env[key];
  return value && value.trim() !== "" ? value : defaultValue;
}
