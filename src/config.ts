type Configuration = import("@/_boot/server").Configuration;

const config: Configuration = {
  http: {
    host: process.env.HOST || "localhost",
    port: Number(process.env.PORT) || 3000,
  },
};

export { config, Configuration };
