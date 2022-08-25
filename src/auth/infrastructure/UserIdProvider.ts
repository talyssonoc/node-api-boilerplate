import { makeIdProvider } from '@/_lib/IdProvider';
import { UserId } from '@/auth/domain/UserId';

const UserIdProvider = makeIdProvider<UserId>('UserId');

export { UserIdProvider };
