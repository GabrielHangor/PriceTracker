async function timerify<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  ...args: Args
): Promise<[T, number]> {
  const start = performance.now();
  const result = await fn(...args);
  const end = performance.now();
  const timeTaken = end - start;

  return [result, timeTaken];
}

export default timerify;
