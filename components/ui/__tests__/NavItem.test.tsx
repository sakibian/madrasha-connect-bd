import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NavItem from '../NavItem';

const renderNavItem = (props: {
  to: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  exact?: boolean;
}, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <NavItem {...props} icon={props.icon || <span>*</span>} />
    </MemoryRouter>
  );
};

describe('NavItem', () => {
  it('renders label', () => {
    renderNavItem({ to: '/', label: 'Home' });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders link with correct href', () => {
    renderNavItem({ to: '/jobs', label: 'Jobs' });
    expect(screen.getByRole('link')).toHaveAttribute('href', '/jobs');
  });

  it('applies active class when route matches', () => {
    renderNavItem({ to: '/jobs', label: 'Jobs' }, '/jobs');
    expect(screen.getByText('Jobs').parentElement?.className).toContain('bg-black');
  });

  it('does not apply active class when route does not match', () => {
    renderNavItem({ to: '/jobs', label: 'Jobs' }, '/fatwa');
    expect(screen.getByText('Jobs').parentElement?.className).not.toContain('bg-black');
  });

  it('uses exact matching when exact prop is true', () => {
    renderNavItem({ to: '/', label: 'Home', exact: true }, '/');
    expect(screen.getByText('Home').parentElement?.className).toContain('bg-black');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    renderNavItem({ to: '/', label: 'Home', onClick });
    await userEvent.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
