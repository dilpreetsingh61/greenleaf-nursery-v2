import client from '../config/redisClient.js';

const shouldLogCacheEvents = process.env.DEBUG_CACHE === 'true';

export const cache = async (req, res, next) => {
  const key = req.originalUrl;

  try {
    const cached = await client.get(key);
    if (cached) {
      if (shouldLogCacheEvents) {
        console.log(`Cache hit for ${key}`);
      }

      return res.json(JSON.parse(cached));
    }

    if (shouldLogCacheEvents) {
      console.log(`Cache miss for ${key}`);
    }

    const originalJson = res.json.bind(res);

    res.json = (data) => {
      client.setEx(key, 120, JSON.stringify(data));
      return originalJson(data);
    };

    next();
  } catch (error) {
    console.error('Redis cache error:', error);
    next();
  }
};
