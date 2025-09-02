import { load } from 'cheerio';
import { fetchText, fetchJson, rateLimited } from '../../core/http.js';

// Loose product-type checks used for the suggestion endpoint. The HTML
// fallback below intentionally keeps filtering minimal so we don't return
// an empty result set when Culture Kings changes their handle patterns.
const TYPE_FILTER: Record<'shirt' | 'pants', RegExp> = {
  shirt: /shirt|tee/i,
  pants: /pant|cargo|jean/i,
};

export async function findHandles(opts: {
  category: 'shirt' | 'pants';
  color?: string;
  limit: number;
}): Promise<string[]> {
  const query = encodeURIComponent([opts.color, opts.category].filter(Boolean).join(' '));
  const suggest = `https://culturekings.com.au/search/suggest.json?q=${query}&resources%5Btype%5D=product&resources%5Blimit%5D=${opts.limit}`;
  const typeRegex = TYPE_FILTER[opts.category];

  try {
    const data = await rateLimited(() => fetchJson(suggest));
    const products = data?.resources?.results?.products ?? [];
    const handles = products
      .filter((p: any) => typeRegex.test(p.product_type || ''))
      .map((p: any) => p.handle);
    if (handles.length) return handles.slice(0, opts.limit);
  } catch {
    /* fall back to HTML search */
  }

  const url = `https://culturekings.com.au/search?q=${query}`;
  const html = await rateLimited(() => fetchText(url));
  const $ = load(html);
  const handles: string[] = [];

  $('a[href*="/products/"]').each((_, el) => {
    if (handles.length >= opts.limit) return false;
    const href = $(el).attr('href') || '';
    const match = href.match(/\/products\/([\w-]+)/);
    if (match) {
      const handle = match[1];
      if (handle.includes('giftcard')) return; // skip obvious non-product entries
      if (!handles.includes(handle)) handles.push(handle);
    }
  });

  return handles;
}
