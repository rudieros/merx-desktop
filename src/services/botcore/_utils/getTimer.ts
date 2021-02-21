export const getTimer = (timeoutMillis: number) => new Promise((res) => setTimeout(res, timeoutMillis));
