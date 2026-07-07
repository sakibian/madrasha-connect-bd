
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

export class RetryError extends Error {
  constructor(public originalError: unknown, public attempts: number) {
    super(`Failed after ${attempts} attempts`);
  }
}

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options?: { maxRetries?: number; baseDelay?: number }
): Promise<T> => {
  const maxRetries = options?.maxRetries ?? MAX_RETRIES;
  const baseDelay = options?.baseDelay ?? BASE_DELAY;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new RetryError(lastError, maxRetries);
};
