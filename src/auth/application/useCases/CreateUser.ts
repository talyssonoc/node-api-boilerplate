import { User } from '@/auth/domain/User';
import { UserRepository } from '@/auth/domain/UserRepository';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
  userRepository: UserRepository;
};

type CreateUserDTO = Readonly<{
  username: string;
  password: string;
  roles: string[];
}>;

type CreateUser = ApplicationService<CreateUserDTO, string>;

const makeCreateUser =
  ({ userRepository }: Dependencies): CreateUser =>
  async (payload) => {
    const id = await userRepository.getNextId();

    const user = User.create({
      id,
      username: payload.username,
      password: payload.password,
      roles: payload.roles,
    });

    await userRepository.store(user);

    return id.value;
  };

export { makeCreateUser };
export type { CreateUser };
