import { initializePaddle, type Paddle } from "@paddle/paddle-js";

type PaddleEnvironment = "live" | "sandbox";

let cachedKey = "";
let cachedPaddlePromise: Promise<Paddle | undefined> | null = null;

export async function getPaddleClient(config: {
  environment: PaddleEnvironment;
  token: string;
}) {
  const cacheKey = `${config.environment}:${config.token}`;
  if (!cachedPaddlePromise || cachedKey !== cacheKey) {
    cachedKey = cacheKey;
    cachedPaddlePromise = initializePaddle({
      token: config.token,
      environment:
        config.environment === "sandbox" ? "sandbox" : undefined,
    });
  }

  return cachedPaddlePromise;
}
