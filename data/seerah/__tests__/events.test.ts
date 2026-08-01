import { describe, it, expect } from 'vitest';
import { SEERAH_EVENTS, eventsByCategory, SEERAH_EVENT_COUNT } from '../events';

describe('SEERAH_EVENTS dataset', () => {
  it('has at least 25 seed events (target: 100+ via DB overlay)', () => {
    expect(SEERAH_EVENTS.length).toBeGreaterThanOrEqual(25);
    expect(SEERAH_EVENT_COUNT).toBe(SEERAH_EVENTS.length);
  });

  it('every event has a unique id', () => {
    const ids = SEERAH_EVENTS.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every event carries at least one citation', () => {
    for (const e of SEERAH_EVENTS) {
      expect(e.citations.length).toBeGreaterThanOrEqual(1);
      for (const c of e.citations) {
        expect(c.reference.length).toBeGreaterThan(2);
      }
    }
  });

  it('events are chronologically ordered by `order`', () => {
    for (let i = 1; i < SEERAH_EVENTS.length; i++) {
      expect(SEERAH_EVENTS[i].order).toBeGreaterThan(SEERAH_EVENTS[i - 1].order);
    }
  });

  it('eventsByCategory returns a subset ordered by `order`', () => {
    const battles = eventsByCategory('battles');
    expect(battles.length).toBeGreaterThan(0);
    for (const e of battles) expect(e.category).toBe('battles');
    for (let i = 1; i < battles.length; i++) {
      expect(battles[i].order).toBeGreaterThan(battles[i - 1].order);
    }
  });

  it('opens with the birth (Year of the Elephant) and closes with the wafat', () => {
    expect(SEERAH_EVENTS[0].id).toBe('birth-570');
    expect(SEERAH_EVENTS[SEERAH_EVENTS.length - 1].id).toBe('wafat-632');
  });
});
