export type RedisConfig = { url: string; token: string };

/**
 * Reads the Upstash REST credentials that the Vercel integration adds.
 * Returns null when neither is set (local dev falls back to JSON files),
 * and throws when only one is set so a half-configured deploy fails loudly.
 */
export function redisConfigFromEnv(env: Record<string, string | undefined>): RedisConfig | null {
  const url = env.KV_REST_API_URL?.trim();
  const token = env.KV_REST_API_TOKEN?.trim();

  if (!url && !token) return null;
  if (!url || !token) {
    throw new Error('Set both KV_REST_API_URL and KV_REST_API_TOKEN, or neither to use local JSON storage.');
  }
  return { url, token };
}
