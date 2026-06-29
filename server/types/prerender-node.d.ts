declare module "prerender-node" {
  import type { RequestHandler } from "express";

  interface Prerender {
    set(name: string, value: unknown): RequestHandler;
  }

  const prerender: Prerender;
  export default prerender;
}
