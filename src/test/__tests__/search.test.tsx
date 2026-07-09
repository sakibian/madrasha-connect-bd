import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from '../../../components/ui/SearchInput';
import { useJobStore } from '../../../stores/useJobStore';

const mockJobs = [
  { id: '1', title: 'Imam', institution: 'Madrasa A', location: 'Dhaka', salary: '15000', type: 'Imam' as const, postedAt: '2024-01-01', verified: true },
  { id: '2', title: 'Teacher', institution: 'Madrasa B', location: 'CTG', salary: '12000', type: 'Teacher' as const, postedAt: '2024-01-02', verified: false },
  { id: '3', title: 'Muazzin', institution: 'Madrasa C', location: 'Chittagong', salary: '10000', type: 'Muazzin' as const, postedAt: '2024-01-03', verified: false },
];

vi.mock('../../../services/dataService', () => ({
  dataService: {
    getJobs: vi.fn(() => Promise.resolve(mockJobs)),
  },
}));

describe('Search Flow', () => {
  it('SearchInput debounces and calls onChange', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Imam' } });
    expect(onChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledWith('Imam');
    vi.useRealTimers();
  });

  it('SearchInput clears value', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    vi.advanceTimersByTime(300);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toHaveValue('');
    vi.useRealTimers();
  });

  it('job store filters jobs', async () => {
    await useJobStore.getState().fetch();
    const jobs = useJobStore.getState().jobs;

    expect(jobs).toHaveLength(3);
    expect(jobs[0].title).toBe('Imam');
    expect(jobs[1].title).toBe('Teacher');
    expect(jobs[2].title).toBe('Muazzin');
  });
});
