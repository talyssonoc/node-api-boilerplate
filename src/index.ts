require("tsconfig-paths").register({
  baseUrl: __dirname,
  paths: { "@/*": ["*"] },
  addMatchAll: false,
});

require("@/_boot")
  .main()
  .catch(err => {
    console.error(err);

    if (process.env.NODE_ENV === "production") {
      process.kill(process.pid, "SIGTERM");
    }
  });
