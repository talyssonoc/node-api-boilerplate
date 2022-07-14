import { Repository } from '@/_lib/DDD';
import { User } from './User';
import { UserId } from './UserId';

type UserRepository = Repository<User.Type> & {
  findByUsername(username: string): Promise<User.Type>;
};

export { UserRepository };
