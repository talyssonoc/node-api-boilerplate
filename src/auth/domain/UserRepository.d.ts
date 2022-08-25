import { Repository } from '@/_lib/DDD';
import { User } from '@/auth/domain/User';

type UserRepository = Repository<User.Type> & {
  findByUsername(username: string): Promise<User.Type>;
};

export { UserRepository };
