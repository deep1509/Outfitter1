export type IntentItem = {
  category: 'shirt' | 'pants';
  color?: string;
  size?: string;
  budgetCents?: number;
};

export type Intent = {
  items: IntentItem[];
  notes?: string;
};

export type ProductSummary = {
  store: 'culturekings';
  handle: string;
  url: string;
  title: string;
  image?: string;
  priceCents?: number;
  currency?: 'AUD';
  options?: Record<string, string[]>;
};

export type VariantPick = {
  variantId: string | null;
  inStock?: boolean;
  chosenOptions: Record<string, string>;
};

export type Suggestion = {
  product: ProductSummary;
  pick: VariantPick | null;
};

export type CartLink = {
  url: string;
  items: { variantId: string; quantity: number }[];
};
