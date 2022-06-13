const adwords = ['buy', 'consume', 'no independent thoughts'];
export const watchWords = ['watch', 'no imagination'];

export function theyLive(list = null) {
  const words = list || adwords;
  const index = random(0, words.length - 1);
  return words[index];
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}