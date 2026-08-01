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

  it('falls back to a gender-aware dicebear URL when no src is provided', () => {
    render(<Avatar name="John Doe" />);
    const img = screen.getByRole('img');
    // Should still render an <img> tag pointing to dicebear (not initials text)
    expect(img).toHaveAttribute('src', expect.stringContaining('dicebear.com'));
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('renders neutral dicebear seed even for single-name input', () => {
    render(<Avatar name="John" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('dicebear.com'));
  });

  it('renders neutral dicebear seed when no name is supplied', () => {
    const { container } = render(<Avatar />);
    // Empty alt makes the image role="presentation", so query the DOM directly.
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img!.getAttribute('src')).toContain('dicebear.com');
  });

  it('pins short-hair top for masculine Bangla names', () => {
    render(<Avatar name="আব্দুল্লাহ আহমেদ" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('top=shortHair'));
    expect(img).not.toHaveAttribute('src', expect.stringContaining('hijab'));
  });

  it('pins hijab top for feminine Bangla names', () => {
    render(<Avatar name="আয়েশা সিদ্দিকা" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('top=hijab'));
  });

  it('shows online indicator when online is true', () => {
    const { container } = render(<Avatar name="John" online={true} />);
    expect(container.querySelector('.bg-bd-green')).toBeInTheDocument();
  });

  it('shows offline indicator when online is false', () => {
    const { container } = render(<Avatar name="John" online={false} />);
    expect(container.querySelector('.bg-gray-300')).toBeInTheDocument();
  });

  it('does not show indicator when online is undefined', () => {
    const { container } = render(<Avatar name="John" />);
    expect(container.querySelector('.bg-bd-green')).not.toBeInTheDocument();
    expect(container.querySelector('.bg-gray-300')).not.toBeInTheDocument();
  });

  it('applies size classes to the image', () => {
    const { rerender } = render(<Avatar name="A" size="sm" />);
    expect(screen.getByRole('img').className).toContain('w-8');

    rerender(<Avatar name="A" size="md" />);
    expect(screen.getByRole('img').className).toContain('w-10');

    rerender(<Avatar name="A" size="lg" />);
    expect(screen.getByRole('img').className).toContain('w-14');
  });
});
