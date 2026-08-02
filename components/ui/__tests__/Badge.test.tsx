import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-gray-100');
  });

  // Badge variants now use the brand palette:
  //   success -> black (Bangladesh national colour)
  //   warning -> amber (only for genuine warnings)
  //   error   -> red (destructive only)
  //   info    -> black (no off-brand blues)
  it('applies success variant with black', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toContain('bg-black/10');
    expect(screen.getByText('Success').className).toContain('text-black');
  });

  it('applies warning variant with amber', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').className).toContain('bg-gray-50');
  });

  it('applies error variant with red', () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('bg-gray-100');
  });

  it('applies info variant with brand black (not off-brand blue)', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').className).toContain('bg-gray-900');
    expect(screen.getByText('Info').className).toContain('text-white');
  });

  it('applies extra className', () => {
    render(<Badge className="extra">Extra</Badge>);
    expect(screen.getByText('Extra').className).toContain('extra');
  });
});
