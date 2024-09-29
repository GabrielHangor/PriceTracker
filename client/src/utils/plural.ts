/**
 * Plural forms for russian words
 * @param  {Integer} count quantity for word
 * @param  {Array}   words Array of words. Example: ['коментарий', 'коментария', 'комментариев']
 * @return {String}        Plural form for word
 */
export const plural = (
  count: number,
  words: [string, string, string],
  options?: { withCount: boolean },
): string => {
  const roundedCount = Math.floor(Math.abs(count));

  const cases = [2, 0, 1, 1, 1, 2];

  const wordIdx =
    roundedCount % 100 > 4 && roundedCount % 100 < 20 ? 2 : cases[Math.min(roundedCount % 10, 5)];

  const currentWord = `${words[wordIdx]}`;

  return options?.withCount ? `${roundedCount} ${currentWord}` : currentWord;
};
