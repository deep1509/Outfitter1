import { load } from 'cheerio';
import { fetchText, fetchJson, rateLimited } from '../../core/http.js';

const TYPE_FILTER: Record<'shirt' | 'pants', RegExp[]> = {
  shirt: [/tee/i, /shirt/i, /t[-\s]?shirt/i],
  pants: [/pant/i, /cargo/i, /jean/i],
};

export async function findHandles(opts: { category: 'shirt' | 'pants'; color?: string; limit: number }): Promise<string[]> {
  const query = encodeURIComponent([opts.color, opts.category].filter(Boolean).join(' '));
  const suggest = `https://culturekings.com.au/search/suggest.json?q=${query}&resources%5Btype%5D=product&resources%5Blimit%5D=${opts.limit}`;
  const regexes = TYPE_FILTER[opts.category];

  try {
    const data = await rateLimited(() => fetchJson(suggest));
    const products = data?.resources?.results?.products ?? [];
    const handles = products
      .filter((p: any) => regexes.some((r) => r.test(p.product_type || '')))
      .map((p: any) => p.handle);
    if (handles.length) return handles.slice(0, opts.limit);
  } catch {
    /* fall back */
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
      if (regexes.some((r) => r.test(handle)) && !handles.includes(handle)) {
        handles.push(handle);
      }
    }
  });

  return handles;
}
