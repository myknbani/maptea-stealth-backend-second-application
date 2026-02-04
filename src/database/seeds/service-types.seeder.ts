import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { ServiceType } from '../../leads/models/service-type.entity';

/**
 * Seeder for the three service types from the exercise requirements:
 * - delivery
 * - pick-up
 * - payment
 */
export class ServiceTypesSeeder extends Seeder {
  override async run(entityManager: EntityManager) {
    const serviceTypes = ['delivery', 'pick-up', 'payment'];

    for (const name of serviceTypes) {
      const serviceType = new ServiceType({ name });
      entityManager.persist(serviceType);
    }
  }
}
