import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';
import { Product } from '../../../types';

const mockProduct: Product = {
  id: '1',
  name: 'Islamic Calligraphy',
  price: 500,
  category: 'Calligraphy',
  image: 'https://example.com/img.jpg',
};

describe('ProductCard', () => {
  it('renders product details', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Islamic Calligraphy')).toBeInTheDocument();
    expect(screen.getByText('Calligraphy')).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<ProductCard product={mockProduct} onClick={onClick} />);
    await userEvent.click(screen.getByText('Islamic Calligraphy'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
