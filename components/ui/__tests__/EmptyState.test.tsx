import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Try again later" />);
    expect(screen.getByText('Try again later')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<EmptyState title="Empty" icon={<span data-testid="icon">📦</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction are provided', () => {
    render(<EmptyState title="Empty" actionLabel="Add Item" onAction={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
  });

  it('does not render action button when onAction is missing', () => {
    render(<EmptyState title="Empty" actionLabel="Add" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const onAction = vi.fn();
    render(<EmptyState title="Empty" actionLabel="Add" onAction={onAction} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
