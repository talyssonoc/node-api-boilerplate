import { DataMapper } from '@/_lib/DDD';
import { from } from 'uuid-mongodb';
import { User } from '@/auth/domain/User';
import { UserSchema } from '@/auth/infrastructure/UserCollection';
import { UserIdProvider } from '@/auth/infrastructure/UserIdProvider';

const UserMapper: DataMapper<User.Type, UserSchema> = {
  toData: (entity) => ({
    _id: from(entity.id.value),
    username: entity.username,
    password: entity.password,
    roles: entity.roles,
    status: entity.status,
    deleted: entity.status === 'DELETED',
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    version: entity.version,
  }),
  toEntity: (data) => ({
    id: UserIdProvider.create(from(data._id).toString()),
    username: data.username,
    password: data.password,
    roles: data.roles,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.createdAt,
    version: data.version,
  }),
};

export { UserMapper };
