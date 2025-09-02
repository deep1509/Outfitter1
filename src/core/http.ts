import { setTimeout as delay } from 'timers/promises';

const UA = 'ck-outfitter-cli/0.1 (+https://example.com)';

export async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

let last = 0;
export async function rateLimited<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const diff = now - last;
  if (diff < 500) await delay(500 - diff);
  last = Date.now();
  return fn();
}
