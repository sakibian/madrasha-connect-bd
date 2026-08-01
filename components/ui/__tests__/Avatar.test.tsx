import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Avatar from '../Avatar';

// Mock boring-avatars so tests don't have to render its SVG.
vi.mock('boring-avatars', () => ({
  default: ({ name }: { name: string }) => <svg data-testid="boring-avatar" data-name={name} />,
}));

describe('Avatar', () => {
  it('renders a real uploaded photo when src is a real URL', () => {
    render(<Avatar src="https://example.com/photo.jpg" name="John Doe" />);
    const img = screen.getByTestId('avatar-photo') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/photo.jpg');
    expect(img.alt).toBe('John Doe');
  });

  it('renders a local boring-avatar when no real src is provided', () => {
    render(<Avatar name="Muhammad Abdullah" />);
    const svg = screen.getByTestId('boring-avatar');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('data-name')).toBe('Muhammad Abdullah');
  });

  it('renders a local avatar for the legacy dicebear src', () => {
    // Legacy seed URLs should now bypass to the local generator.
    render(<Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=x" name="Anyone" />);
    expect(screen.getByTestId('boring-avatar')).toBeInTheDocument();
  });

  it('renders a local avatar for the picsum stub src', () => {
    render(<Avatar src="https://picsum.photos/seed/user/100/100" name="Anyone" />);
    expect(screen.getByTestId('boring-avatar')).toBeInTheDocument();
  });

  it('shows online indicator when online is true', () => {
    const { container } = render(<Avatar name="John" online />);
    expect(container.querySelector('.bg-bd-green')).toBeInTheDocument();
  });

  it('shows offline indicator when online is false', () => {
    const { container } = render(<Avatar name="John" online={false} />);
    expect(container.querySelector('.bg-gray-300')).toBeInTheDocument();
  });

  it('does not show any indicator when online is undefined', () => {
    const { container } = render(<Avatar name="John" />);
    expect(container.querySelector('.bg-bd-green')).not.toBeInTheDocument();
    expect(container.querySelector('.bg-gray-300')).not.toBeInTheDocument();
  });

  it('applies size classes to the outer box', () => {
    const { container, rerender } = render(<Avatar name="A" size="sm" />);
    expect(container.querySelector('.w-8')).toBeInTheDocument();

    rerender(<Avatar name="A" size="md" />);
    expect(container.querySelector('.w-10')).toBeInTheDocument();

    rerender(<Avatar name="A" size="lg" />);
    expect(container.querySelector('.w-14')).toBeInTheDocument();
  });

  it('provides a screen-reader-only initials label', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});
