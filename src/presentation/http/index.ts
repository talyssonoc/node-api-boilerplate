import { bootstrap } from "@/presentation/http/boot";
import express from "express";

const makeApp = async () => {
  const app = express();

  await bootstrap(app);

  app.start = () => {
    app.listen(3002, () => {
      console.log("Webserver listening on port 3002");
    });
  };

  return app;
};

export { makeApp };
