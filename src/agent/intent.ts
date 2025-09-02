import { z } from 'zod';
import OpenAI from 'openai';
import type { Intent, IntentItem } from '../core/types.js';

const itemSchema = z.object({
  category: z.enum(['shirt', 'pants']),
  color: z.string().optional(),
  size: z.string().optional(),
  budgetCents: z.number().optional(),
});

const intentSchema = z.object({
  items: z.array(itemSchema),
  notes: z.string().optional(),
});

export async function parseIntent(input: string): Promise<Intent> {
  const key = process.env.OPENAI_API_KEY;
  if (key) {
    try {
      const client = new OpenAI({ apiKey: key });
      const resp = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
          { role: 'system', content: 'Extract shopping intent for Culture Kings. Respond in JSON.' },
          { role: 'user', content: input },
        ],
      });
      const txt = resp.choices[0].message?.content || '{}';
      return intentSchema.parse(JSON.parse(txt));
    } catch {
      /* fall back */
    }
  }

  // Rule-based fallback
  const lower = input.toLowerCase();
  const items: IntentItem[] = [];
  if (lower.includes('shirt')) items.push({ category: 'shirt' });
  if (lower.includes('pant')) items.push({ category: 'pants' });

  const colorMatch = lower.match(/\b(red|black|white)\b/);
  const sizeMatch = lower.match(/size\s*([a-z0-9]+)/);
  const budgetMatch = lower.match(/\$?\s*(\d+)/);

  for (const item of items) {
    if (colorMatch) item.color = colorMatch[1];
    if (sizeMatch) item.size = sizeMatch[1];
    if (budgetMatch) item.budgetCents = Number(budgetMatch[1]) * 100;
  }

  return { items };
}
