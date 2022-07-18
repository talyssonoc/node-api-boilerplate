import { Router } from 'express';
import { authenticateHandler } from './AuthenticateHandler';
import { createUserHandler } from './CreateUserHandler';

type Dependencies = {
  apiRouter: Router;
};

const makeAuthController = ({ apiRouter }: Dependencies) => {
  const router = Router();

  router.post('/auth', authenticateHandler);
  router.post('/register', createUserHandler);

  apiRouter.use(router);
};

export { makeAuthController };
