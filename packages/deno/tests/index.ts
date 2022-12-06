import JWTR from '../src/mod.ts';
import { assertEquals, assertThrows } from 'https://deno.land/std@0.167.0/testing/asserts.ts';

const validToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOiI5MDAwMDAwMDAxMDAwIiwiaWF0IjoiOTAwMDAwMDAwMDAwMCIsInBheWxvYWQiOiJ7XCJoZWxsb1wiOlwid29ybGRcIn0ifQ.aZ-Y_RLDRUNBNp5CLMqpuwz_rusmf24-niApYYTmw94';

Deno.test('can instantiate jwtr', () => {
  new JWTR('secret');
});

Deno.test('can sign a payload', () => {
  const jwtr = new JWTR('my-secret');
  const token = jwtr.sign({ hello: 'world' }, { exp: 9000000001000, iat: 9000000000000 });
  assertEquals(token, validToken);
});

Deno.test('can verify a payload', () => {
  const jwtr = new JWTR('my-secret');
  const payload = jwtr.verify(validToken);
  assertEquals(payload, { hello: 'world' });
});

Deno.test('cannot verify an invalid secret', () => {
  const jwtr = new JWTR('wrong-secret');
  assertThrows(() => {
    jwtr.verify(validToken);
  });
});

Deno.test('cannot verify an invalid token', () => {
  const jwtr = new JWTR('my-secret');
  assertThrows(() => {
    jwtr.verify(validToken.slice(0, -1) + 'a');
  });
});

Deno.test('cannot verify an expired token', () => {
  const jwtr = new JWTR('my-secret');
  const token = jwtr.sign({ hello: 'world' }, { exp: Date.now() / 1000 - 1000, iat: Date.now() / 1000 });

  assertThrows(() => {
    jwtr.verify(token);
  });
});
