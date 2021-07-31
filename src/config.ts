type Configuration = import("@/_boot/server").Configuration & import("@/_boot/database").Configuration;

const config: Configuration = {
  http: {
    host: process.env.HOST || "localhost",
    port: Number(process.env.PORT) || 3000,
  },
  mongodb: {
    database: process.env.DB_NAME || "blog",
    host: process.env.DB_HOST || "mongodb://localhost:27017",
    username: process.env.DB_USER || "blog",
    password: process.env.DB_PASS || "blog",
  },
};

export { config, Configuration };
