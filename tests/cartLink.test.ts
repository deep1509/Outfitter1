import { describe, it, expect } from 'vitest';
import { buildCartLink } from '../src/shops/culturekings/cartLink.js';

describe('cartLink', () => {
  it('builds correct cart URL', () => {
    const link = buildCartLink([
      { variantId: '111', quantity: 1 },
      { variantId: '222', quantity: 1 },
    ]);
    expect(link.url).toBe('https://culturekings.com.au/cart/111:1,222:1');
  });
});
