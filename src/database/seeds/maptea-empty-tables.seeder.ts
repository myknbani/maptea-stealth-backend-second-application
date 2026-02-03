import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { OnlyUserSeeder } from './only-user.seeder';

/**
 * Seeder to populate the database with required or dummy data, as long as the tables are empty.
 * Checking for emptiness is the responsibility of the individual seeders, and this class will not
 * enforce it, only serving as a grouping mechanism.
 */
export class MapteaEmptyTablesSeeder extends Seeder {
  run(entityManager: EntityManager) {
    return this.call(entityManager, [OnlyUserSeeder]);
  }
}
