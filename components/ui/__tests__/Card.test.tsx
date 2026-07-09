import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>content</p></Card>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies padding classes', () => {
    const { rerender } = render(<Card padding="sm">Sm</Card>);
    expect(screen.getByText('Sm').className).toContain('p-6');

    rerender(<Card padding="md">Md</Card>);
    expect(screen.getByText('Md').className).toContain('p-8');

    rerender(<Card padding="lg">Lg</Card>);
    expect(screen.getByText('Lg').className).toContain('p-10');
  });

  it('applies hover class when hover prop is true', () => {
    render(<Card hover>Hover</Card>);
    expect(screen.getByText('Hover').className).toContain('hover:border-gray-300');
  });

  it('does not apply hover class by default', () => {
    render(<Card>No hover</Card>);
    expect(screen.getByText('No hover').parentElement?.className).not.toContain('hover:border-gray-300');
  });

  it('renders Card.Header', () => {
    render(<Card><Card.Header>Header</Card.Header></Card>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders Card.Body', () => {
    render(<Card><Card.Body>Body</Card.Body></Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('renders Card.Footer', () => {
    render(<Card><Card.Footer>Footer</Card.Footer></Card>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
