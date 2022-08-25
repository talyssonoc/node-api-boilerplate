import { UserId } from '@/auth/domain/UserId';
import { AggregateRoot } from '@/_lib/DDD';

namespace User {
  type Status = 'ACTIVE' | 'DELETED';

  type User = AggregateRoot<UserId> &
    Readonly<{
      username: string;
      password: string;
      roles: string[];
      status: Status;
      createdAt: Date;
      updatedAt: Date;
      version: number;
    }>;

  type UserProps = Readonly<{
    id: UserId;
    username: string;
    password: string;
    roles: string[];
  }>;

  export const create = (props: UserProps): User => ({
    ...props,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 0,
  });

  export const markAsDeleted = (self: User): User => ({
    ...self,
    username: `${self.username}.${Date.now()}`,
    status: 'DELETED',
  });

  export type Type = User;
}

export { User };
