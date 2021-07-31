import { Server } from "http";
import { logger } from "@/_lib/logger";
import { RequestHandler } from "express";

const gracefulShutdown = (server: Server, forceTimeout = 30000): RequestHandler => {
  let shuttingDown = false;

  const gracefulExit = () => {
    if (!process.env.NODE_ENV?.match(/^prod/i)) {
      return process.exit(1);
    }

    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.warn("Received kill signal (SIGTERM), shutting down");

    setTimeout(() => {
      logger.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, forceTimeout).unref();

    server.close(() => {
      logger.info("Closed out remaining connections.");
      process.exit();
    });
  };

  process.on("SIGTERM", gracefulExit);

  return (req, res, next) => {
    if (!shuttingDown) {
      return next();
    }

    res.set("Connection", "close");
    res.status(503).send("Server is in the process of restarting.");
  };
};

export { gracefulShutdown };
