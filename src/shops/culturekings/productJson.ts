import { fetchJson } from '../../core/http.js';

export async function fetchProductJson(handle: string): Promise<any> {
  const url = `https://culturekings.com.au/products/${handle}.js`;
  return fetchJson(url);
}
