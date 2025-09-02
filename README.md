# ck-outfitter-cli

A minimal terminal-only demo that helps you build a Culture Kings cart using **public** endpoints only.
No private Shopify APIs. No payments. Just product discovery and cart permalinks.

## Quick start
```bash
pnpm install
cp .env.example .env        # set OPENAI_API_KEY for LLM parsing (optional)
pnpm dev
```

Type something like:
```
I want a red shirt and matching cargo trousers (size M, budget $150).
```

The agent suggests a few shirts and pants, lets you request more options,
and can offer matching items if you only asked for one category.
Pick what you like and the CLI prints a cart link:
```
https://culturekings.com.au/cart/<variantId1>:1,<variantId2>:1
```
Open the link in a browser to see the prefilled cart.

## Scripts
- `pnpm dev` – start the CLI
- `pnpm test` – run unit tests (Vitest)

## Safety & Limitations
- Uses only public product pages and search results; be gentle with requests.
- Product pages may change without notice; the demo may break.
- If a variant can’t be resolved, the CLI prints the product page URL instead.
- No automatic checkout or payment.

This is a learning/demo tool—use responsibly.
