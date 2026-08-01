import { describe, it, expect } from 'vitest';
import { PARTNERSHIPS, partnershipsByCategory } from '../partnerships';

describe('PARTNERSHIPS registry', () => {
  it('has a stable, unique slug for every partner', () => {
    const slugs = PARTNERSHIPS.map(p => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('every partner has a name, proposal, and status', () => {
    for (const p of PARTNERSHIPS) {
      expect(p.name.length).toBeGreaterThan(1);
      expect(p.proposal.length).toBeGreaterThan(10);
      expect(p.status).toBeDefined();
    }
  });

  it('partnershipsByCategory filters correctly', () => {
    const ngos = partnershipsByCategory('ngo');
    expect(ngos.length).toBeGreaterThan(0);
    for (const p of ngos) {
      expect(p.categories).toContain('ngo');
    }
  });
});
