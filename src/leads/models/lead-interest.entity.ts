import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { ServiceType } from './service-type.entity';
import { Lead } from './lead.entity';

/**
 * This is a pivot entity for many-to-many relationship between {@link Lead} and {@link ServiceType}.
 *
 * Currently, it has no additional properties beyond the relationships and timestamps.
 *
 * @see {@link https://mikro-orm.io/docs/collections#custom-pivot-table-entity MikroORM Pivot Entity}
 */
@Entity()
export class LeadInterest {
  /**
   * The lead interested in the paired service type.  This and {@link serviceType} form a composite
   * primary key.
   */
  @ManyToOne(() => Lead, { primary: true })
  lead!: Lead;

  /**
   * The service type that the paired lead is interested in.  This and {@link lead} form a composite
   * primary key.
   */
  @ManyToOne(() => ServiceType, { primary: true })
  serviceType!: ServiceType;

  /**
   * Date and time when the lead interest was created.  This is populated by the DB, and not the
   * ORM, since MikroORM only seems to populate the composite primary key fields.
   */
  @Property({ defaultRaw: 'NOW()' })
  createdAt: Date;

  constructor(data: Partial<LeadInterest>) {
    Object.assign(this, data);
  }
}
