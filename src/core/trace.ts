type AsyncFn = (...args: any[]) => Promise<any>;

let cachedTraceable: ((fn: AsyncFn, opts: { name: string }) => AsyncFn) | null = null;

async function getTraceable() {
  if (cachedTraceable) return cachedTraceable;
  try {
    const mod: any = await import('langsmith');
    cachedTraceable = mod.traceable;
  } catch {
    cachedTraceable = (fn: AsyncFn) => fn;
  }
  return cachedTraceable;
}

export function withTrace<T extends AsyncFn>(name: string, fn: T): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const trace = await getTraceable();
    const wrapped = trace(fn, { name });
    return wrapped(...args);
  }) as T;
}
