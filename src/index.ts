import bindings from '../native/jwtrust.node';
import { convertTime } from './utils/convertTime';

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
    { exp = convertTime('7d'), iat = Date.now() }: JWTOptions = {
      exp: convertTime('7d'),
      iat: Date.now()
    }
  ): string {
    try {
      return bindings.sign(this.secret, JSON.stringify(payload), {
        exp,
        iat
      });
    } catch (err) {
      throw new JWTRError((err as Error).message, 'sign');
    }
  }

  public verify(token: string): T {
    try {
      const output = bindings.verify(this.secret, token);

      if (output.exp && output.exp < Date.now()) throw new Error('Token expired');

      return JSON.parse(output.payload) as T;
    } catch (err) {
      throw new JWTRError((err as Error).message, 'verify');
    }
  }
}

export { convertTime, JWTR, JWTOptions };
export default JWTR;
