import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard icon={<span>*</span>} label="Jobs" value={42} />);
    expect(screen.getByText('Jobs')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders as button when onClick is provided', () => {
    render(<StatCard icon={<span>*</span>} label="Jobs" value={5} onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders as div when onClick is not provided', () => {
    render(<StatCard icon={<span>*</span>} label="Jobs" value={5} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClick when button is clicked', async () => {
    const onClick = vi.fn();
    render(<StatCard icon={<span>*</span>} label="Jobs" value={5} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
