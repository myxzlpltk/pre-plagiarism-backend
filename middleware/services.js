const Minio = require("minio");
const redis = require("redis");

const services = {
  minio: (req, res, next) => {
    // Create a minio client
    req.app.locals.minio = new Minio.Client({
      endPoint: "localhost",
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
    next();
  },
  redis: async (req, res, next) => {
    // Create a redis client
    req.app.locals.redis = redis.createClient({
      host: "localhost",
      port: 6379,
    });
    await req.app.locals.redis.connect();
    next();
  },
};

module.exports = services;