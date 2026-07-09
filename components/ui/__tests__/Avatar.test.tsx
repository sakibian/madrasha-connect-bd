import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Avatar from '../Avatar';

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/photo.jpg" name="John Doe" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('renders initials when no src', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders fallback ? when no name', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('shows online indicator when online is true', () => {
    render(<Avatar name="John" online={true} />);
    const container = screen.getByText('J').closest('.relative');
    expect(container?.querySelector('.bg-bd-green')).toBeInTheDocument();
  });

  it('shows offline indicator when online is false', () => {
    render(<Avatar name="John" online={false} />);
    const container = screen.getByText('J').closest('.relative');
    expect(container?.querySelector('.bg-gray-300')).toBeInTheDocument();
  });

  it('does not show indicator when online is undefined', () => {
    const { container } = render(<Avatar name="John" />);
    expect(container.querySelector('.bg-bd-green')).not.toBeInTheDocument();
    expect(container.querySelector('.bg-gray-300')).not.toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender } = render(<Avatar name="A" size="sm" />);
    expect(screen.getByText('A').className).toContain('w-8');

    rerender(<Avatar name="A" size="md" />);
    expect(screen.getByText('A').className).toContain('w-10');

    rerender(<Avatar name="A" size="lg" />);
    expect(screen.getByText('A').className).toContain('w-14');
  });
});
