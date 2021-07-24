require("tsconfig-paths").register({
  baseUrl: __dirname,
  paths: { "@/*": ["*"] },
  addMatchAll: false,
});

require("./presentation/http")
  .makeApp()
  .then(app => app.start())
  .catch(console.error);
