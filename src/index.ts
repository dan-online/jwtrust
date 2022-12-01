import bindings from "../native/jwtrust.node";
import { convertTime } from "./utils/convertTime";

export interface JWTOptions {
  iat: number;
  exp: number;
}

export class JWTR<T = unknown> {
  secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(
    payload: T,
    { exp = convertTime("7d"), iat = Date.now() }: JWTOptions = {
      exp: convertTime("7d"),
      iat: Date.now(),
    }
  ): string {
    return bindings.sign(this.secret, JSON.stringify(payload), {
      exp,
      iat,
    });
  }

  decode(token: string): T {
    const output = bindings.verify(this.secret, token);

    if (output.exp && output.exp < Date.now()) throw new Error("Token expired");

    return JSON.parse(output.payload) as T;
  }
}
