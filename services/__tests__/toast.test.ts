import { describe, it, expect, vi, beforeEach } from 'vitest';

/*
 * `vi.mock` is hoisted to the top of the file, so any helper variables it
 * references must be created *inside* the factory. We therefore expose the
 * mock methods through the mocked module itself and pull them back in the
 * tests via a dynamic import.
 */
vi.mock('sonner', () => {
  const fn = (name: string) => Object.assign(vi.fn(), { _name: name });
  const success = fn('success');
  const error = fn('error');
  const info = fn('info');
  const warning = fn('warning');
  const loading = fn('loading');
  const dismiss = fn('dismiss');
  const promise = fn('promise');
  const base = Object.assign(
    (msg: string) => info(msg),
    { success, error, info, warning, loading, dismiss, promise },
  );
  return { toast: base };
});

import { toast as sonner } from 'sonner';
import { toast } from '../toast';

describe('typed toast wrapper', () => {
  beforeEach(() => {
    (sonner as unknown as { success: ReturnType<typeof vi.fn> }).success.mockReset();
    (sonner as unknown as { error: ReturnType<typeof vi.fn> }).error.mockReset();
    (sonner as unknown as { promise: ReturnType<typeof vi.fn> }).promise.mockReset();
  });

  it('forwards success calls to sonner.success', () => {
    toast.success('সংরক্ষিত');
    expect((sonner as unknown as { success: ReturnType<typeof vi.fn> }).success).toHaveBeenCalledWith('সংরক্ষিত', undefined);
  });

  it('normalises Error objects to a message string', () => {
    toast.error(new Error('nope'));
    expect((sonner as unknown as { error: ReturnType<typeof vi.fn> }).error).toHaveBeenCalledWith('nope', undefined);
  });

  it('normalises unknown values to a safe fallback string', () => {
    toast.error(undefined);
    const spy = (sonner as unknown as { error: ReturnType<typeof vi.fn> }).error;
    const [firstArg] = spy.mock.calls[0];
    expect(typeof firstArg).toBe('string');
    expect(firstArg.length).toBeGreaterThan(0);
  });

  it('passes descriptions through as sonner options', () => {
    toast.success('ok', 'extra detail');
    expect((sonner as unknown as { success: ReturnType<typeof vi.fn> }).success).toHaveBeenCalledWith('ok', { description: 'extra detail' });
  });

  it('forwards promise() to sonner.promise', () => {
    const p = Promise.resolve(1);
    toast.promise(p, { loading: 'l', success: 's', error: 'e' });
    expect((sonner as unknown as { promise: ReturnType<typeof vi.fn> }).promise).toHaveBeenCalledWith(p, { loading: 'l', success: 's', error: 'e' });
  });
});
