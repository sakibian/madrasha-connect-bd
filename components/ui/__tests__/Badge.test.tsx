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
    expect(screen.getByText('Default').className).toContain('bg-muted');
  });

  // Badge variants now use the theme token palette:
  //   success -> primary (brand emerald)
  //   warning -> amber (only for genuine warnings)
  //   error   -> destructive (only for genuine danger)
  //   info    -> secondary slate (no off-brand blues)
  it('applies success variant with primary', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toContain('text-primary');
  });

  it('applies warning variant with amber', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning').className).toContain('text-warning-700');
  });

  it('applies error variant with red', () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error').className).toContain('text-destructive');
  });

  it('applies info variant with secondary (not off-brand blue)', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info').className).toContain('bg-secondary');
    expect(screen.getByText('Info').className).toContain('text-secondary-foreground');
  });

  it('applies extra className', () => {
    render(<Badge className="extra">Extra</Badge>);
    expect(screen.getByText('Extra').className).toContain('extra');
  });
});
