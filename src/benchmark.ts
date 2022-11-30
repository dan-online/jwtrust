import { JWTR } from ".";

const runs = 1000000;
const randomKey = (key: string = "") => {
  if (key.length >= 32) return key.slice(0, 32);
  return randomKey(key + Math.random().toString(36).substring(2));
}; // not super random but good enough https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const test = (jwt: JWTR) => {
  const payload = randomKey();
  const start = performance.now();
  const token = jwt.sign(payload);
  jwt.decode(token);
  const end = performance.now();
  return end - start;
};

const benchmark = () => {
  const jwt = new JWTR(randomKey());

  let total = 0;
  for (let i = 0; i < runs; i++) {
    total += test(jwt);
  }

  console.table({
    [`${runs} runs`]: {
      "Average (ms)": (total / runs).toFixed(2),
      "Operations (op/s)": (runs / (total / 1000)).toFixed(0),
      "Total (s)": (total / 1000).toFixed(2),
    },
  });
};

benchmark();
