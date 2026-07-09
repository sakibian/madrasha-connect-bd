import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FatwaCard from '../FatwaCard';
import { Fatwa } from '../../../types';

const mockFatwa: Fatwa = {
  id: '1',
  question: 'Is this permissible?',
  category: 'Ibadah',
  askedBy: 'user1',
  askedAt: '2024-01-01',
  status: 'PENDING',
};

describe('FatwaCard', () => {
  it('renders question', () => {
    render(<FatwaCard fatwa={mockFatwa} />);
    expect(screen.getByText('Is this permissible?')).toBeInTheDocument();
  });

  it('shows PENDING status badge', () => {
    render(<FatwaCard fatwa={mockFatwa} />);
    expect(screen.getByText('অপেক্ষমান')).toBeInTheDocument();
  });

  it('shows ANSWERED status badge', () => {
    render(<FatwaCard fatwa={{ ...mockFatwa, status: 'ANSWERED' }} />);
    expect(screen.getByText('উত্তরিত')).toBeInTheDocument();
  });

  it('shows REJECTED status badge', () => {
    render(<FatwaCard fatwa={{ ...mockFatwa, status: 'REJECTED' }} />);
    expect(screen.getByText('প্রত্যাখ্যাত')).toBeInTheDocument();
  });

  it('renders answer preview when answer exists', () => {
    render(<FatwaCard fatwa={{ ...mockFatwa, status: 'ANSWERED', answer: 'Yes, it is permissible.' }} />);
    expect(screen.getByText('Yes, it is permissible.')).toBeInTheDocument();
  });

  it('truncates long answer', () => {
    const longAnswer = 'a'.repeat(300);
    render(<FatwaCard fatwa={{ ...mockFatwa, status: 'ANSWERED', answer: longAnswer }} />);
    expect(screen.getByText(`${'a'.repeat(200)}...`)).toBeInTheDocument();
  });

  it('renders answer button when onAnswer is provided', () => {
    render(<FatwaCard fatwa={mockFatwa} onAnswer={vi.fn()} />);
    expect(screen.getByText('উত্তর দিন')).toBeInTheDocument();
  });

  it('renders view button when onView is provided', () => {
    render(<FatwaCard fatwa={mockFatwa} onView={vi.fn()} />);
    expect(screen.getByText('দেখুন')).toBeInTheDocument();
  });

  it('calls onAnswer when answer button is clicked', async () => {
    const onAnswer = vi.fn();
    render(<FatwaCard fatwa={mockFatwa} onAnswer={onAnswer} />);
    await userEvent.click(screen.getByText('উত্তর দিন'));
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it('calls onView when view button is clicked', async () => {
    const onView = vi.fn();
    render(<FatwaCard fatwa={mockFatwa} onView={onView} />);
    await userEvent.click(screen.getByText('দেখুন'));
    expect(onView).toHaveBeenCalledTimes(1);
  });
});
