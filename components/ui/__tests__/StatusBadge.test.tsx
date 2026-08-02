import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders the Bangla label by default', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('অনুমোদিত')).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<StatusBadge status="pending" label="Awaiting review" />);
    expect(screen.getByText('Awaiting review')).toBeInTheDocument();
  });

  it('carries a data-status attribute for e2e selectors', () => {
    const { container } = render(<StatusBadge status="banned" />);
    expect(container.querySelector('[data-status="banned"]')).toBeInTheDocument();
  });

  it('uses the danger palette for rejected/banned', () => {
    const { container } = render(<StatusBadge status="rejected" />);
    const el = container.firstElementChild!;
    expect(el.className).toContain('bg-gray-100');
    expect(el.className).toContain('text-black');
  });

  it('uses the warning palette for pending/flagged', () => {
    const { container } = render(<StatusBadge status="flagged" />);
    const el = container.firstElementChild!;
    expect(el.className).toContain('bg-gray-50');
  });

  it('uses the brand palette for approved/active', () => {
    const { container } = render(<StatusBadge status="active" />);
    const el = container.firstElementChild!;
    expect(el.className).toContain('bg-gray-50');
    expect(el.className).toContain('text-black');
  });
});
