const COLOR_MAP: Record<string, string[]> = {
  red: ['red', 'crimson', 'burgundy', 'maroon'],
  black: ['black'],
  white: ['white'],
};

export function normalizeColor(input?: string): string | undefined {
  if (!input) return undefined;
  const lower = input.toLowerCase();
  for (const [base, variants] of Object.entries(COLOR_MAP)) {
    if (variants.includes(lower)) return base;
  }
  return lower;
}

export function normalizeSize(input?: string): string | undefined {
  if (!input) return undefined;
  return input.trim().toUpperCase();
}

export function normalizeOptionName(name: string): string {
  return name.trim().toLowerCase();
}
