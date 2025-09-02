import pino from 'pino';
import inquirer from 'inquirer';
import { askDescription, pickSuggestion } from './ui/prompt.js';
import { parseIntent } from './agent/intent.js';
import { plan } from './agent/plan.js';
import { buildCartLink } from './shops/culturekings/cartLink.js';
import type { IntentItem, Suggestion } from './core/types.js';

const log = pino({ level: 'info' });

async function handleItem(item: IntentItem, label: string): Promise<Suggestion | null> {
  let limit = 5;
  let current = item;
  for (;;) {
    const res = await plan({ items: [current] }, limit);
    const choice = await pickSuggestion(res[item.category], label, true);
    if (choice === 'more') {
      limit += 5;
      continue;
    }
    if (!choice) {
      const { retry } = await inquirer.prompt<{ retry: boolean }>([
        { type: 'confirm', name: 'retry', message: `No ${label} selected. Try a new search?`, default: false },
      ]);
      if (!retry) return null;
      const desc = await askDescription(`Describe the ${label} you want:`);
      const newIntent = await parseIntent(desc);
      const newItem = newIntent.items.find((i) => i.category === item.category);
      if (!newItem) return null;
      current = newItem;
      limit = 5;
      continue;
    }
    return choice;
  }
}

async function main() {
  console.log('Culture Kings outfitter demo. Uses public endpoints only.\n');

  const desc = await askDescription();
  const intent = await parseIntent(desc);

  if (intent.items.length === 0) {
    console.log('No valid intent found.');
    return;
  }

  let shirt: Suggestion | null = null;
  let pants: Suggestion | null = null;

  for (const item of intent.items) {
    if (item.category === 'shirt') shirt = await handleItem(item, 'shirt');
    else if (item.category === 'pants') pants = await handleItem(item, 'pants');
  }

  if (!pants) {
    const { want } = await inquirer.prompt<{ want: boolean }>([
      { type: 'confirm', name: 'want', message: 'Would you like matching pants?', default: false },
    ]);
    if (want) {
      const descP = await askDescription('Describe the pants you want:');
      const intentP = await parseIntent(descP);
      const itemP = intentP.items.find((i) => i.category === 'pants');
      if (itemP) pants = await handleItem(itemP, 'pants');
    }
  }

  if (!shirt) {
    const { want } = await inquirer.prompt<{ want: boolean }>([
      { type: 'confirm', name: 'want', message: 'Would you like to see shirts?', default: false },
    ]);
    if (want) {
      const descS = await askDescription('Describe the shirt you want:');
      const intentS = await parseIntent(descS);
      const itemS = intentS.items.find((i) => i.category === 'shirt');
      if (itemS) shirt = await handleItem(itemS, 'shirt');
    }
  }

  const items = [] as { variantId: string; quantity: number }[];
  if (shirt?.pick?.variantId) items.push({ variantId: shirt.pick.variantId, quantity: 1 });
  if (pants?.pick?.variantId) items.push({ variantId: pants.pick.variantId, quantity: 1 });

  if (items.length) {
    const link = buildCartLink(items);
    console.log('\nCart link:', link.url);
  } else {
    if (shirt) console.log('Shirt page:', shirt.product.url);
    if (pants) console.log('Pants page:', pants.product.url);
    console.log('Could not build cart link automatically.');
  }
}

main().catch((err) => {
  log.error(err);
  process.exit(1);
});
