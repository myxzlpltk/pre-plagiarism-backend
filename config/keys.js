function mongoURL(options) {
  options = options || {};
  let URL = "mongodb://";
  if (options.password && options.username) URL += options.username + ":" + options.password + "@";
  URL += (options.host || "localhost") + ":";
  URL += (options.port || "27017") + "/";
  URL += (options.database || "admin");
  return URL;
}

module.exports = {
  mongoURI: mongoURL({
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD,
    database: process.env.MONGODB_DATABASE,
  }),
};