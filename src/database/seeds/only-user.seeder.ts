import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import bcrypt from 'bcryptjs';
import { User } from '../../auth/models/user.entity';

/**
 * Seeder to populate the database with a single user, for demo purposes of the authenticated
 * version of the `leads` query.
 */
export class OnlyUserSeeder extends Seeder {
  async run(entityManager: EntityManager) {
    const repository = entityManager.getRepository(User);

    if ((await repository.count()) > 0) {
      return;
    }

    // normally we would not do this in a public repo 😂, but this is for convenience of the demo
    const hashedPassword = await bcrypt.hash('admin', 10);
    repository.create(new User({ username: 'admin', hashedPassword }));
  }
}
