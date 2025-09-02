import { describe, it, expect } from 'vitest';
import { matchVariant } from '../src/core/match.js';

describe('match', () => {
  it('matches color synonyms and size (case-insensitive)', () => {
    const product = {
      options: [{ name: 'Color' }, { name: 'Size' }],
      variants: [
        { id: 1, available: true, options: ['Crimson', 'M'] },
        { id: 2, available: true, options: ['Blue', 'M'] },
      ],
    };

    const pick = matchVariant(product, { Color: 'Red', Size: 'm' });
    expect(pick.variantId).toBe('1');
  });
});
