import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSkeleton from '../LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders text variant by default', () => {
    const { container } = render(<LoadingSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders card variant', () => {
    const { container } = render(<LoadingSkeleton variant="card" />);
    expect(container.querySelector('.minimal-border')).toBeInTheDocument();
  });

  it('renders list variant', () => {
    const { container } = render(<LoadingSkeleton variant="list" />);
    expect(container.querySelector('.minimal-border')).toBeInTheDocument();
  });

  it('renders table variant', () => {
    const { container } = render(<LoadingSkeleton variant="table" />);
    expect(container.querySelector('.minimal-border')).toBeInTheDocument();
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThanOrEqual(4);
  });

  it('renders multiple items when count is set', () => {
    const { container } = render(<LoadingSkeleton variant="card" count={3} />);
    expect(container.querySelectorAll('.minimal-border').length).toBe(3);
  });
});
