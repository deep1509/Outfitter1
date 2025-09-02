import inquirer from 'inquirer';
import type { Suggestion } from '../core/types.js';

export async function askDescription(): Promise<string> {
  const { desc } = await inquirer.prompt<{ desc: string }>([
    { type: 'input', name: 'desc', message: 'Describe what you want:' },
  ]);
  return desc;
}

export async function pickSuggestion(sugs: Suggestion[], label: string): Promise<Suggestion | null> {
  if (sugs.length === 0) return null;

  const choices = sugs.map((s, i) => ({
    name: `${i + 1}. ${s.product.title} - ${
      s.product.priceCents ? '$' + (s.product.priceCents / 100).toFixed(2) : 'N/A'
    } (${s.product.url})`,
    value: i,
  }));

  const { idx } = await inquirer.prompt<{ idx: number }>([
    { type: 'list', name: 'idx', message: `Select a ${label}:`, choices },
  ]);

  return sugs[idx];
}
