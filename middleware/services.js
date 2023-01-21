const Minio = require("minio");
const redis = require("redis");

const services = {
  minio: (req, res, next) => {
    // Create a minio client
    req.app.locals.minio = new Minio.Client({
      endPoint: process.env.MINIO_HOST,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
    next();
  },
  redis: async (req, res, next) => {
    // Create a redis client
    req.app.locals.redis = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }
    });
    await req.app.locals.redis.connect();
    next();
  },
};

module.exports = services;