import { describe, expect, it } from 'vitest';
import { redisConfigFromEnv } from './redis-env';

describe('redisConfigFromEnv', () => {
  it('returns null when neither variable is set', () => {
    expect(redisConfigFromEnv({})).toBeNull();
    expect(redisConfigFromEnv({ KV_REST_API_URL: ' ', KV_REST_API_TOKEN: '' })).toBeNull();
  });

  it('returns trimmed credentials when both are set', () => {
    expect(redisConfigFromEnv({ KV_REST_API_URL: ' https://kv.example.com ', KV_REST_API_TOKEN: 'token ' })).toEqual({
      url: 'https://kv.example.com',
      token: 'token',
    });
  });

  it('throws when only one is set', () => {
    expect(() => redisConfigFromEnv({ KV_REST_API_URL: 'https://kv.example.com' })).toThrow(/KV_REST_API_TOKEN/);
    expect(() => redisConfigFromEnv({ KV_REST_API_TOKEN: 'token' })).toThrow(/KV_REST_API_URL/);
  });
});
