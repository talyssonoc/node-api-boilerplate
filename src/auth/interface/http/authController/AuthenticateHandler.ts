import { makeValidator } from '@/_lib/http/validation/Validator';
import { handler } from '@/_lib/http/handler';
import Joi from 'types-joi';
import { Authenticate } from '../../../application/useCases/Authenticate';
import { ensureRole } from '@/auth/_lib/security/Credentials';

type Dependencies = {
  authenticate: Authenticate;
};

const { getBody } = makeValidator({
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
});

const authenticateHandler = handler(({ authenticate }: Dependencies) => async (req, res) => {
  // ensureRole('WRITER'); //estava como um array, mas a func handler reclamou [ensure(), handler()]
  const { username, password } = getBody(req);

  const securityPass = await authenticate({ username, password });

  res.json(securityPass);
});
export { authenticateHandler };
