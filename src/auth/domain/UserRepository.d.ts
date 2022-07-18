import { Repository } from '@/_lib/DDD';
import { User } from './User';

type UserRepository = Repository<User.Type> & {
  findByUsername(username: string): Promise<User.Type>;
};

export { UserRepository };
