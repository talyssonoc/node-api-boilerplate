import { Repository } from '@/_lib/DDD';
import { User } from './User';
<<<<<<< Updated upstream
import { UserId } from './UserId';
=======
>>>>>>> Stashed changes

type UserRepository = Repository<User.Type> & {
  findByUsername(username: string): Promise<User.Type>;
};

export { UserRepository };
