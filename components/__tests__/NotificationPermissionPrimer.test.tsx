import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotificationPermissionPrimer, { isPrimerSuppressed } from '../NotificationPermissionPrimer';

// Mock webPush + toast to keep tests deterministic.
vi.mock('../../services/webPush', () => ({
  isPushSupported: () => true,
  subscribeToPush: vi.fn().mockResolvedValue({ endpoint: 'x' }),
  sendSubscriptionToServer: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../../services/toast', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

// Mock the Notification.permission getter.
function setPermission(value: NotificationPermission) {
  Object.defineProperty(window, 'Notification', {
    value: Object.assign(function () {}, { permission: value, requestPermission: vi.fn() }),
    configurable: true,
    writable: true,
  });
}

describe('NotificationPermissionPrimer', () => {
  beforeEach(() => {
    localStorage.clear();
    setPermission('default');
  });

  it('renders nothing when open=false', () => {
    const { container } = render(<NotificationPermissionPrimer open={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the primer when open=true and permission is default', () => {
    render(<NotificationPermissionPrimer open onClose={() => {}} vapidPublicKey="test" />);
    expect(screen.getByTestId('notif-primer')).toBeInTheDocument();
    expect(screen.getByText(/হ্যাঁ, জানাতে চাই/)).toBeInTheDocument();
  });

  it('renders nothing when permission is already granted', () => {
    setPermission('granted');
    const { container } = render(<NotificationPermissionPrimer open onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a hint when permission is denied', () => {
    setPermission('denied');
    render(<NotificationPermissionPrimer open onClose={() => {}} />);
    expect(screen.getByTestId('notif-primer-denied')).toBeInTheDocument();
  });

  it('dismiss button writes suppression timestamp + closes', () => {
    const onClose = vi.fn();
    render(<NotificationPermissionPrimer open onClose={onClose} vapidPublicKey="test" />);
    fireEvent.click(screen.getByRole('button', { name: /পরে/ }));
    expect(onClose).toHaveBeenCalled();
    expect(localStorage.getItem('notif-primer-dismissed-at')).toBeTruthy();
    expect(isPrimerSuppressed()).toBe(true);
  });
});
