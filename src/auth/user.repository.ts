import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './models/user.entity';

export class UserRepository extends EntityRepository<User> {}
