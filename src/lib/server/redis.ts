import { RedisClient } from 'bun';

export const redisSubscriber = new RedisClient(process.env.REDIS_URL);
export const redisPublisher = new RedisClient(process.env.REDIS_URL);

await redisSubscriber.connect();
await redisPublisher.connect();
