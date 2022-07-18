import { CreateUser } from '@/auth/application/useCases/CreateUser';
import { makeValidator } from '@/_lib/http/validation/Validator';
import { handler } from '@/_lib/http/handler';
import Joi from 'types-joi';

type Dependencies = {
  createUser: CreateUser;
};

const { getBody } = makeValidator({
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    roles: Joi.array().items(Joi.string().required()).required(),
  }).required(),
});

const createUserHandler = handler(({ createUser }: Dependencies) => async (req, res) => {
  const { username, password, roles } = getBody(req);

  const id = await createUser({ username, password, roles });

  res.json({ id });
});

export { createUserHandler };
