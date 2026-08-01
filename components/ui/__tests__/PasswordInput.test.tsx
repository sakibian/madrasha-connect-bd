import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordInput from '../PasswordInput';

describe('PasswordInput', () => {
  it('renders as type=password by default and hides the value', () => {
    render(<PasswordInput defaultValue="secret123" />);
    const input = screen.getByDisplayValue('secret123') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('toggles to type=text when the eye button is clicked', () => {
    render(<PasswordInput defaultValue="secret123" />);
    const input = screen.getByDisplayValue('secret123') as HTMLInputElement;
    const toggle = screen.getByRole('button', { name: /পাসওয়ার্ড দেখান/ });
    fireEvent.click(toggle);
    expect(input.type).toBe('text');
    // Second click hides again.
    fireEvent.click(screen.getByRole('button', { name: /পাসওয়ার্ড লুকান/ }));
    expect(input.type).toBe('password');
  });

  it('sets aria-pressed on the toggle to reflect visibility', () => {
    render(<PasswordInput />);
    const toggle = screen.getByRole('button', { name: /পাসওয়ার্ড দেখান/ });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /পাসওয়ার্ড লুকান/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('meets the 44×44 tap target minimum on the toggle', () => {
    render(<PasswordInput />);
    const toggle = screen.getByRole('button', { name: /পাসওয়ার্ড দেখান/ });
    expect(toggle.className).toContain('min-h-[44px]');
    expect(toggle.className).toContain('min-w-[44px]');
  });

  it('forwards arbitrary input props like name/autoComplete', () => {
    // Password inputs have no ARIA role, so query the DOM directly.
    const { container } = render(<PasswordInput name="pw" autoComplete="current-password" />);
    const el = container.querySelector('input[name="pw"]') as HTMLInputElement;
    expect(el).not.toBeNull();
    expect(el.autocomplete).toBe('current-password');
  });
});
