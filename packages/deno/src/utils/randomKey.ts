export const randomKey = (size: number, key = ''): string => {
  if (key.length >= size) return key.slice(0, size);
  return randomKey(size, key + Math.random().toString(36).substring(2));
}; // not super random but good enough https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
