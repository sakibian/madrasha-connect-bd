import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import JobCard from '../JobCard';
import { Job } from '../../../types';

const mockJob: Job = {
  id: '1',
  title: 'Imam',
  institution: 'Madrasa',
  location: 'Dhaka',
  salary: '15,000',
  type: 'Imam',
  postedAt: '2024-01-01',
  verified: true,
};

describe('JobCard', () => {
  it('renders job details', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Madrasa')).toBeInTheDocument();
    expect(screen.getByText('Dhaka')).toBeInTheDocument();
    expect(screen.getByText('15,000')).toBeInTheDocument();
  });

  it('shows VERIFIED badge when job is verified', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
  });

  it('shows PENDING badge when job is not verified', () => {
    render(<JobCard job={{ ...mockJob, verified: false }} />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders apply button when onApply is provided', () => {
    render(<JobCard job={mockJob} onApply={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not render apply button when onApply is not provided', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onApply when button is clicked', async () => {
    const onApply = vi.fn();
    render(<JobCard job={mockJob} onApply={onApply} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onApply).toHaveBeenCalledTimes(1);
  });
});
