import { Duffel } from "@duffel/api";

export function getDuffel() {
  return new Duffel({ token: process.env.DUFFEL_ACCESS_TOKEN! });
}
