import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
  it('renders input with search placeholder', () => {
    render(<SearchInput onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(<SearchInput onChange={vi.fn()} placeholder="Find..." />);
    expect(screen.getByPlaceholderText('Find...')).toBeInTheDocument();
  });

  it('calls onChange after debounce delay', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} debounce={300} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(onChange).toHaveBeenCalledWith('test');
    vi.useRealTimers();
  });

  it('shows clear button when value exists', () => {
    vi.useFakeTimers();
    render(<SearchInput onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    vi.advanceTimersByTime(300);
    expect(screen.getByRole('button')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('clears input when clear button is clicked', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<SearchInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    vi.advanceTimersByTime(300);
    fireEvent.click(screen.getByRole('button'));
    expect(input).toHaveValue('');
    vi.useRealTimers();
  });

  it('uses external value when provided', () => {
    render(<SearchInput onChange={vi.fn()} value="external" />);
    expect(screen.getByRole('textbox')).toHaveValue('external');
  });
});
