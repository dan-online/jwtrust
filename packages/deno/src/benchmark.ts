import { JWTR } from './mod.ts';
import { randomKey } from './utils/randomKey.ts';
import { Spinner } from 'https://esm.sh/@favware/colorette-spinner@1.0.1';
const runs = 100000;
const payloadLength = 16;

console.log(`\nJWTRust Benchmark commencing, runs set at ${runs} and ${payloadLength} payload length.\n`);

interface jwtlike {
  sign: (payload: any) => string;
  verify: (token: string) => any;
}

export const test = (jwt: jwtlike) => {
  const payload = randomKey(payloadLength);
  const start = performance.now();

  const token = jwt.sign({ importantValue: payload });
  jwt.verify(token);

  const end = performance.now();

  return end - start;
};

const spinner = new Spinner(`Benchmark`);
export const benchmark = (name: string, runner: jwtlike) => {
  spinner.start({
    text: `Benchmarking (${name}): 0/${runs}`
  });

  let total = 0;
  let lastUpdate = Date.now();

  for (let i = 0; i < runs; i++) {
    total += test(runner);
    spinner.update({
      text: `Benchmarking (${name}): ${i + 1}/${runs}`
    });

    if (lastUpdate + 50 < Date.now()) {
      lastUpdate = Date.now();
      spinner.spin();
    }
  }

  return {
    [name]: {
      'Average (ms)': (total / runs).toFixed(3),
      'Operations (op/s)': Math.round(runs / (total / 1000)).toLocaleString(),
      'Total (s)': (total / 1000).toFixed(2)
    }
  };
};

const secret = randomKey(32);
const jwtr = new JWTR(secret);
const jwtrResults = benchmark('JWTRust (Deno)', jwtr);

spinner.success({ text: 'Benchmarking complete!' });
console.table({
  ...jwtrResults
});
