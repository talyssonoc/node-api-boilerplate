require("tsconfig-paths").register({
  baseUrl: __dirname,
  paths: { "@/*": ["*"] },
  addMatchAll: false,
});

require("@/_boot")
  .bootstrap()
  .catch((err) => {
    console.error(err);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
