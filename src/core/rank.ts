import { Suggestion } from './types.js';
import { normalizeColor } from './normalize.js';

export function rankSuggestions(
  sugs: Suggestion[],
  desired: { color?: string; size?: string; budgetCents?: number }
): Suggestion[] {
  return sugs
    .map((s) => {
      let score = 0;
      const desiredColor = normalizeColor(desired.color);
      const pickedColor = normalizeColor(s.pick?.chosenOptions?.color || s.pick?.chosenOptions?.colour);
      if (desiredColor && pickedColor === desiredColor) score += 2;

      if (desired.size && s.pick?.chosenOptions?.size?.toUpperCase() === desired.size.toUpperCase())
        score += 2;

      if (
        desired.budgetCents &&
        s.product.priceCents &&
        s.product.priceCents <= desired.budgetCents
      )
        score += 1;

      return { s, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
}
