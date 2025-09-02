import { describe, it, expect, vi } from 'vitest';
import { fetchProductJson } from '../src/shops/culturekings/productJson.js';

describe('productJson', () => {
  it('fetches and parses product JSON', async () => {
    const product = { title: 'Test', options: [{ name: 'Color', values: ['Red'] }], variants: [] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(product))));
    const data = await fetchProductJson('test');
    expect(data.title).toBe('Test');
    expect(data.options[0].name).toBe('Color');
  });
});
