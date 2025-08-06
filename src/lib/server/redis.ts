import { createClient } from 'redis';

export const redisSubscriber = createClient({
	url: process.env.REDIS_URL
});

export const redisPublisher = createClient({
	url: process.env.REDIS_URL
});

redisSubscriber.on('error', (err) => console.error('Redis subscriber error:', err));
redisPublisher.on('error', (err) => console.error('Redis publisher error:', err));

await redisSubscriber.connect();
await redisPublisher.connect();
