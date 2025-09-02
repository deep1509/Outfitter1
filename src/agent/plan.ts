import type { Intent, Suggestion, IntentItem } from '../core/types.js';
import { findHandles } from '../shops/culturekings/finder.js';
import { fetchProductJson } from '../shops/culturekings/productJson.js';
import { fetchProductFromHtml } from '../shops/culturekings/htmlParser.js';
import { matchVariant } from '../core/match.js';
import { rankSuggestions } from '../core/rank.js';

async function resolveHandle(handle: string) {
  try {
    return await fetchProductJson(handle);
  } catch {
    return await fetchProductFromHtml(handle);
  }
}

async function suggestForItem(item: IntentItem, limit = 5): Promise<Suggestion[]> {
  const handles = await findHandles({ category: item.category, color: item.color, limit });
  const suggestions: Suggestion[] = [];

  for (const handle of handles) {
    try {
      const product = await resolveHandle(handle);
      const summary = {
        store: 'culturekings' as const,
        handle,
        url: `https://culturekings.com.au/products/${handle}`,
        title: product.title,
        image: product.images?.[0]?.src,
        priceCents: product.price ? Number(product.price) * 100 : undefined,
        currency: 'AUD' as const,
        options: product.options?.reduce((acc: Record<string, string[]>, o: any) => {
          acc[o.name] = o.values;
          return acc;
        }, {}),
      };
      const pick = matchVariant(product, { Color: item.color, Size: item.size });
      suggestions.push({ product: summary, pick });
    } catch {
      /* ignore individual failures */
    }
  }

  return rankSuggestions(suggestions, item);
}

export async function plan(intent: Intent, limit = 5): Promise<Record<'shirt' | 'pants', Suggestion[]>> {
  const result: Record<'shirt' | 'pants', Suggestion[]> = { shirt: [], pants: [] };
  for (const item of intent.items) {
    const sugs = await suggestForItem(item, limit);
    result[item.category] = sugs.slice(0, 3);
  }
  return result;
}

export { suggestForItem };
