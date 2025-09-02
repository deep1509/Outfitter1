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

You’ll get 2–3 shirts and 2–3 pants suggestions.
Pick one of each and the CLI prints a cart link:
```
https://culturekings.com.au/cart/<variantId1>:1,<variantId2>:1
```
Open the link in a browser to see the prefilled cart.

## Architecture

The CLI is composed of a few small nodes that pass data along a linear path:

- **UI prompts** (`src/ui/prompt.ts`) ask for a free-form description and later
  let you pick from ranked suggestions.
- **Intent parser** (`src/agent/intent.ts`) turns the description into a typed
  `Intent` using OpenAI when an API key is supplied, or a rule-based fallback
  otherwise.
- **Planner** (`src/agent/plan.ts`) searches Culture Kings for matching
  products, resolves their variants and ranks them.
- **Cart builder** (`src/shops/culturekings/cartLink.ts`) converts the chosen
  variants into a shareable cart URL.

Data flows from the user ➜ intent ➜ suggestions ➜ feedback ➜ cart link.

### LangSmith tracing

To record a trace of a run, export the following environment variables before
starting the CLI:

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY="<your LangSmith key>"
export LANGCHAIN_PROJECT="ck-outfitter-cli"
```

Traces will then appear in your LangSmith project for inspection.

## Transcript

An example run with feedback-driven selections and the resulting cart link:

```
$ pnpm dev
Culture Kings outfitter demo. Uses public endpoints only.

Describe what you want:
> I want a red shirt and matching cargo trousers, size M, budget $150.

Select a shirt:
  1. Example Shirt - $79.95 (https://culturekings.com.au/products/example-shirt)
  2. Another Shirt - $89.95 (...)
> 1

Select a pants:
  1. Example Cargo - $120.00 (https://culturekings.com.au/products/example-cargo)
  2. Another Cargo - $99.95 (...)
> 2

Cart link: https://culturekings.com.au/cart/11111111111111:1,22222222222222:1
```

## Scripts
- `pnpm dev` – start the CLI
- `pnpm test` – run unit tests (Vitest)

## Safety & Limitations
- Uses only public product pages and search results; no private or authenticated
  APIs.
- The demo does not throttle requests—keep usage light to avoid rate limiting.
- Product pages may change without notice; the demo may break.
- If a variant can’t be resolved, the CLI prints the product page URL instead.
- No automatic checkout or payment.

This is a learning/demo tool—use responsibly.
