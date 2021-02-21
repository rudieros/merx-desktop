export const getLogger = (name: string) => ({
  log: (...m) => console.log(`[${name}] `, ...m),
  error: (...m) => console.error(`[${name}] `, ...m),
});
