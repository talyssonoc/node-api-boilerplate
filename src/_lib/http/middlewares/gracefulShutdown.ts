import { Server } from 'http';
import { logger } from '@/_lib/logger';
import { RequestHandler } from 'express';

type ShutdownMiddleware = {
  shutdownHook: () => Promise<void>;
  shutdownHandler: () => RequestHandler;
};

const gracefulShutdown = (server: Server, forceTimeout = 30000): ShutdownMiddleware => {
  let shuttingDown = false;

  const shutdownHook = () =>
    new Promise<void>((resolve, reject) => {
      if (!process.env.NODE_ENV?.match(/^prod/i) || !server.listening) {
        return resolve();
      }

      shuttingDown = true;

      logger.warn('Shutting down server');

      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        resolve();
      }, forceTimeout).unref();

      server.close((err) => {
        if (err) return reject(err);

        logger.info('Closed out remaining connections.');
        resolve();
      });
    });

  return {
    shutdownHandler: () => (req, res, next) => {
      if (!shuttingDown) {
        return next();
      }

      res.set('Connection', 'close');
      res.status(503).send('Server is in the process of restarting.');
    },
    shutdownHook,
  };
};

export { gracefulShutdown };
