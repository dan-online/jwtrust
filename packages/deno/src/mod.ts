import { instantiate } from '../../../native/deno_jwtrust.generated.js';
import { convertTime } from './utils/convertTime.ts';

export const version = '1.0.1';

const location = Deno.env.get('JWT_TEST')
  ? new URL('../../../native/deno_jwtrust_bg.wasm', import.meta.url)
  : new URL(`https://github.com/dan-online/jwtrust/releases/download/v${version}/deno_jwtrust_bg.wasm`);

const { Claims, sign, verify } = await instantiate({
  url: location
});

interface JWTOptions {
  iat: number;
  exp: number;
}

class JWTRError extends Error {
  public constructor(message: string, action: string) {
    super(message);
    this.name = 'JWTRError';
    this.message = `unable to ${action}: ${message}`;
  }
}

/**
 * JWTrust is a class that wraps the JWTrust native module.
 * It provides a simple interface to generate and verify JWTs.
 * @class
 */
class JWTR<T = unknown> {
  private secret: string;

  /**
   * JWTrust is a class that wraps the JWTrust native module.
   * It provides a simple interface to generate and verify JWTs.
   * @param {string} key - The key to use for signing and verifying JWTs.
   * @example
   * ```js
   * const { JWTrust } = require("jwtrust");
   *
   * const jwtrust = new JWTrust("my-secret");
   * const token = jwtrust.sign({ hello: "world" }); // eyJ0eXAiOiJKV1QiLCJhb...
   *
   * const payload = jwtrust.verify(token); // { hello: "world" }
   * ```
   */
  public constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Sign a payload with the secret key.
   * @param {T} payload - The payload to sign.
   * @param {JWTOptions} options - The options to use for signing.
   * @returns {string} The signed JWT.
   * @example
   * ```js
   * const { convertTime } = require("jwtrust");
   *
   * const token = jwtrust.sign({ hello: "world" }); // eyJ0eXAiOiJKV1QiLCJhb...
   * const token = jwtrust.sign({ hello: "world" }, { exp: Date.now() + 1000 }); // expires in one second
   * const token = jwtrust.sign({ hello: "world" }, { exp: convertTime("3d") }); // expires in 3 days
   * ```
   */
  public sign(
    payload: T,
    { exp = convertTime('7d'), iat = Date.now() / 1000 }: JWTOptions = {
      exp: convertTime('7d'),
      iat: Date.now()
    }
  ): string {
    try {
      return sign(this.secret, JSON.stringify(payload), exp, iat);
    } catch (err) {
      throw new JWTRError((err as Error).message, 'sign');
    }
  }

  /**
   * Verify and decode token with the secret key to a payload
   * @param {string} token - The token to verify and decode.
   * @returns {T} The encoded payload.
   * @example
   * ```js
   * const token = jwtrust.sign({ hello: "world" }); // eyJ0eXAiOiJKV1QiLCJhb...
   * const payload = jwtrust.verify(token); // { hello: "world" }
   * ```
   */
  public verify(token: string): T {
    try {
      const output = verify(this.secret, token);
      const exp = output.get_exp();
      const payload = output.get_payload();
      if (exp && exp < Date.now() / 1000) throw new Error('token expired');

      return JSON.parse(payload) as T;
    } catch (err) {
      throw new JWTRError((err as Error).message, 'verify');
    }
  }
}

export { convertTime, JWTR };
export type { JWTOptions };
export default JWTR;
