import cheerio from 'cheerio';
import { fetchText } from '../../core/http.js';

export async function fetchProductFromHtml(handle: string): Promise<any> {
  const url = `https://culturekings.com.au/products/${handle}`;
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  const script = $('script[type="application/ld+json"]').first().html();
  if (script) {
    try {
      return JSON.parse(script);
    } catch {
      /* ignore */
    }
  }

  const data = $('[data-product-json]').attr('data-product-json');
  if (data) return JSON.parse(data);

  throw new Error('Product JSON not found in HTML');
}
