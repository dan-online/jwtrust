import { JWTR } from '.';
import { randomKey } from './utils/randomKey';
import { Spinner } from '@favware/colorette-spinner';

const runs = 1000000;
const payloadLength = 128;

console.log(`\nJWTRust Benchmark commencing, runs set at ${runs} and ${payloadLength} payload length.\n`);

const test = (jwt: JWTR) => {
  const payload = randomKey(payloadLength);
  const start = performance.now();
  const token = jwt.sign(payload);

  jwt.verify(token);

  const end = performance.now();

  return end - start;
};

const benchmark = () => {
  const jwt = new JWTR(randomKey(32));
  const spinner = new Spinner(`Benchmark`).start({
    text: `Benchmarking: 0/${runs}`
  });

  let total = 0;
  let lastUpdate = Date.now();

  for (let i = 0; i < runs; i++) {
    total += test(jwt);
    spinner.update({
      text: `Benchmarking: ${i + 1}/${runs}`
    });

    if (lastUpdate + 50 < Date.now()) {
      lastUpdate = Date.now();
      spinner.spin();
    }
  }

  spinner.success({ text: 'Benchmarking complete!' });

  console.table({
    [`${runs} runs`]: {
      'Average (ms)': (total / runs).toFixed(2),
      'Operations (op/s)': (runs / (total / 1000)).toFixed(0),
      'Total (s)': (total / 1000).toFixed(2)
    }
  });
};

benchmark();
