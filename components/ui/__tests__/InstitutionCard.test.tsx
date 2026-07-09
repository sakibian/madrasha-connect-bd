import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import InstitutionCard from '../InstitutionCard';
import { Institution } from '../../../types';

const mockInstitution: Institution = {
  id: '1',
  name: 'Al-Madrasa',
  type: 'Qawmi',
  location: 'Dhaka',
  district: 'Dhaka',
  established: '1990',
  verified: true,
  studentCount: 500,
  image: 'https://example.com/img.jpg',
};

describe('InstitutionCard', () => {
  it('renders institution details', () => {
    render(<InstitutionCard institution={mockInstitution} />);
    expect(screen.getByText('Al-Madrasa')).toBeInTheDocument();
    expect(screen.getByText(/Dhaka/)).toBeInTheDocument();
    expect(screen.getByText(/শিক্ষার্থী/)).toBeInTheDocument();
  });

  it('shows ভেরিফাইড badge when verified', () => {
    render(<InstitutionCard institution={mockInstitution} />);
    expect(screen.getByText('ভেরিফাইড')).toBeInTheDocument();
  });

  it('shows পেন্ডিং badge when not verified', () => {
    render(<InstitutionCard institution={{ ...mockInstitution, verified: false }} />);
    expect(screen.getByText('পেন্ডিং')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<InstitutionCard institution={mockInstitution} onClick={onClick} />);
    await userEvent.click(screen.getByText('Al-Madrasa'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
