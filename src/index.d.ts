declare module "*.node" {
  export function sign(
    token: string,
    payload: string,
    options: {
      iat: number;
      exp: number;
    }
  ): string;
  export function verify(
    token: string,
    encoded: string
  ): { payload: string; exp?: number; iat?: number };
}
