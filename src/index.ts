import pino from 'pino';
import { askDescription, pickSuggestion } from './ui/prompt.js';
import { parseIntent } from './agent/intent.js';
import { plan } from './agent/plan.js';
import { buildCartLink } from './shops/culturekings/cartLink.js';
import { withTrace } from './core/trace.js';

const log = pino({ level: 'info' });

async function _main() {
  console.log('Culture Kings outfitter demo. Uses public endpoints only.\n');

  const desc = await askDescription();
  const intent = await parseIntent(desc);

  if (intent.items.length === 0) {
    console.log('No valid intent found.');
    return;
  }

  const suggestions = await plan(intent);

  const shirt = await pickSuggestion(suggestions.shirt, 'shirt');
  const pants = await pickSuggestion(suggestions.pants, 'pants');

  const items = [];
  if (shirt?.pick?.variantId) items.push({ variantId: shirt.pick.variantId, quantity: 1 });
  if (pants?.pick?.variantId) items.push({ variantId: pants.pick.variantId, quantity: 1 });

  if (items.length) {
    const tracedBuild = withTrace('buildCartLink', async (its: typeof items) => buildCartLink(its));
    const link = await tracedBuild(items);
    console.log('\nCart link:', link.url);
  } else {
    if (shirt) console.log('Shirt page:', shirt.product.url);
    if (pants) console.log('Pants page:', pants.product.url);
    console.log('Could not build cart link automatically.');
  }
}

const main = withTrace('main', _main);

main().catch((err) => {
  log.error(err);
  process.exit(1);
});
