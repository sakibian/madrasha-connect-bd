import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../Modal';

describe('Modal', () => {
  it('does not render when open is false', () => {
    render(<Modal open={false} onClose={vi.fn()}>Content</Modal>);
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<Modal open={true} onClose={vi.fn()}>Content</Modal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Modal">Content</Modal>);
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  it('calls onClose when clicking overlay', async () => {
    const onClose = vi.fn();
    const { container } = render(<Modal open={true} onClose={onClose}>Content</Modal>);
    const overlay = container.querySelector('.fixed.inset-0');
    await userEvent.click(overlay!);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when clicking inside modal', async () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose}>Content</Modal>);
    await userEvent.click(screen.getByText('Content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing Escape', async () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose}>Content</Modal>);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('renders close button when title is present', async () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="Title">Content</Modal>);
    const closeBtn = screen.getByRole('button', { name: '' });
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
