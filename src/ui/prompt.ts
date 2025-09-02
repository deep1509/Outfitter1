import inquirer from 'inquirer';
import type { Suggestion } from '../core/types.js';

export async function askDescription(message = 'Describe what you want:'): Promise<string> {
  const { desc } = await inquirer.prompt<{ desc: string }>([
    { type: 'input', name: 'desc', message },
  ]);
  return desc;
}

export async function pickSuggestion(
  sugs: Suggestion[],
  label: string,
  allowMore = false
): Promise<Suggestion | 'more' | null> {
  if (sugs.length === 0) return null;

  const choices = sugs.map((s, i) => ({
    name: `${i + 1}. ${s.product.title} - ${
      s.product.priceCents ? '$' + (s.product.priceCents / 100).toFixed(2) : 'N/A'
    } (${s.product.url})`,
    value: String(i),
  }));

  if (allowMore) choices.push({ name: 'Show me more', value: '__more' });
  choices.push({ name: 'None of these', value: '__none' });

  const { choice } = await inquirer.prompt<{ choice: string }>([
    { type: 'list', name: 'choice', message: `Select a ${label}:`, choices },
  ]);

  if (choice === '__more') return 'more';
  if (choice === '__none') return null;
  return sugs[Number(choice)];
}
