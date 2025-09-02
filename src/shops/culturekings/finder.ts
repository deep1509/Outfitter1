import cheerio from 'cheerio';
import { fetchText, rateLimited } from '../../core/http.js';

export async function findHandles(opts: { category: 'shirt' | 'pants'; color?: string; limit: number }): Promise<string[]> {
  const parts = [];
  if (opts.color) parts.push(opts.color);
  parts.push(opts.category);
  if (opts.category === 'pants') parts.push('cargo');
  const q = encodeURIComponent(parts.join(' '));
  const url = `https://culturekings.com.au/search?q=${q}`;

  const html = await rateLimited(() => fetchText(url));
  const $ = cheerio.load(html);
  const handles: string[] = [];

  $('a[href*="/products/"]').each((_, el) => {
    if (handles.length >= opts.limit) return false;
    const href = $(el).attr('href') || '';
    const match = href.match(/\/products\/([\w-]+)/);
    if (match) {
      const handle = match[1];
      if (!handles.includes(handle)) handles.push(handle);
    }
  });

  return handles;
}
