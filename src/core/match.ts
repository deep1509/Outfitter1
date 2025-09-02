import { VariantPick } from './types.js';
import { normalizeColor, normalizeSize, normalizeOptionName } from './normalize.js';

export function matchVariant(product: any, desired: Record<string, string | undefined>): VariantPick {
  const desiredColor = normalizeColor(desired.Color ?? desired.Colour);
  const desiredSize = normalizeSize(desired.Size);

  const optNames = product.options.map((o: any) => normalizeOptionName(o.name));

  for (const variant of product.variants) {
    let ok = true;
    const chosen: Record<string, string> = {};
    variant.options.forEach((val: string, idx: number) => {
      const key = optNames[idx];
      const normVal = normalizeOptionName(val);

      if (key === 'color' || key === 'colour') {
        const vColor = normalizeColor(normVal);
        if (desiredColor && vColor !== desiredColor) ok = false;
        chosen[key] = val;
      } else if (key === 'size') {
        const vSize = normalizeSize(normVal);
        if (desiredSize && vSize !== desiredSize) ok = false;
        chosen[key] = val;
      } else {
        chosen[key] = val;
      }
    });

    if (ok) {
      return {
        variantId: String(variant.id),
        inStock: variant.available,
        chosenOptions: chosen,
      };
    }
  }

  return { variantId: null, chosenOptions: {} };
}
