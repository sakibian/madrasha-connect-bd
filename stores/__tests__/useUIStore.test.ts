import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false, activeModal: null });
  });

  it('initializes with sidebar closed and no modal', () => {
    const state = useUIStore.getState();
    expect(state.sidebarOpen).toBe(false);
    expect(state.activeModal).toBeNull();
  });

  it('setSidebarOpen opens sidebar', () => {
    useUIStore.getState().setSidebarOpen(true);
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it('setSidebarOpen closes sidebar', () => {
    useUIStore.getState().setSidebarOpen(true);
    useUIStore.getState().setSidebarOpen(false);
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('toggleSidebar toggles sidebar state', () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it('openModal sets active modal', () => {
    useUIStore.getState().openModal('fatwa-modal');
    expect(useUIStore.getState().activeModal).toBe('fatwa-modal');
  });

  it('closeModal clears active modal', () => {
    useUIStore.getState().openModal('modal');
    useUIStore.getState().closeModal();
    expect(useUIStore.getState().activeModal).toBeNull();
  });
});
