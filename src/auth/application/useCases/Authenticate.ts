import { Credentials, SecurityBooth, SecurityPass } from '@/_lib/security';
import { ApplicationService } from '@/_lib/DDD';
import { UserRepository } from '@/auth/domain/UserRepository';

type Dependencies = {
  signerService: SecurityBooth;
  userRepository: UserRepository;
};

type AuthenticationDTO = {
  username: string;
  password: string;
};

type Authenticate = ApplicationService<AuthenticationDTO, SecurityPass>;

const makeAuthenticate =
  ({ signerService, userRepository }: Dependencies): Authenticate =>
  async ({ password, username }) => {
    const user = await userRepository.findByUsername(username);
    //verificar senha, desencriptar e verificar
    const credentials = Credentials.create({
      principalId: user.username,
      role: user.roles,
      meta: { userId: user.id.value },
    });

    return signerService.sign(<Credentials.Type<Record<string, any>, string>>credentials);
  };

export { makeAuthenticate };
export type { Authenticate };
