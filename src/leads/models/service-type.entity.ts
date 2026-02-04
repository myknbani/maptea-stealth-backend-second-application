import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Lead } from './lead.entity';

/**
 * Entity representing a type of service offered.
 *
 * From the exercise requirements, it currently has three values:
 * - delivery
 * - pick-up
 * - payment
 *
 * But it does not feel _"constant"_ enough to be an enum, so we use an entity.
 */
@Entity()
export class ServiceType {
  /**
   * Primary key -- auto-incrementing integer.
   */
  @PrimaryKey()
  id!: number;

  /**
   * Name of the service type -- unique constraint.
   *
   * @example "delivery"
   */
  @Property({ unique: true })
  name: string;

  /**
   * Timestamp when the service type was created.
   */
  @Property()
  createdAt: Date = new Date();

  /**
   * Timestamp when the service type was last updated.
   *
   * Identical to {@link createdAt} on creation.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Leads that are interested in this service type.
   */
  @ManyToMany({ entity: () => Lead, mappedBy: (lead) => lead.serviceTypes })
  leads = new Collection<Lead>(this);

  constructor(data?: Partial<ServiceType>) {
    Object.assign(this, data);
  }
}
