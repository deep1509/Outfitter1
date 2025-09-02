import type { CartLink } from '../../core/types.js';

export function buildCartLink(items: { variantId: string; quantity: number }[]): CartLink {
  if (!items.length) throw new Error('No items');
  const parts = items.map((i) => `${i.variantId}:${i.quantity}`);
  return {
    url: `https://culturekings.com.au/cart/${parts.join(',')}`,
    items,
  };
}
