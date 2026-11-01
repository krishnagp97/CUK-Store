import { redis } from "./redis";

export async function getCache<T>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number,
): Promise<void> {
  await redis.set(key, value, {
    ex: ttl,
  });
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

export async function deleteCacheByPattern(
  pattern: string,
): Promise<void> {
  let cursor = "0";

  do {
    const result = await redis.scan(cursor, {
      match: pattern,
      count: 100,
    });

    cursor = result[0];

    const keys = result[1];

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== "0");
}