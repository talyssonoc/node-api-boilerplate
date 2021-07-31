require("tsconfig-paths").register({
  baseUrl: __dirname,
  paths: { "@/*": ["*"] },
  addMatchAll: false,
});

require("@/_boot")
  .bootstrap()
  .catch(console.error);
