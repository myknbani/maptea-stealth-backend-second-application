import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { LeadInterest } from './lead-interest.entity';
import { ServiceType } from './service-type.entity';

/**
 * It represents a potential lead / customer who takes an interest in our services.
 */
@Entity()
@ObjectType()
export class Lead {
  /**
   * Primary key -- auto-incrementing integer.
   */
  @PrimaryKey()
  @Field(() => Int) // integer rather than Javascript's number type
  id!: number;

  /**
   * Full name of the lead.
   */
  @Property()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  /**
   * Email address of the lead -- unique constraint.
   */
  @Property({ unique: true })
  @IsEmail()
  email: string;

  /**
   * Mobile number of the lead in E.164 format.
   */
  @Property()
  @IsPhoneNumber()
  mobileNumber: string;

  /**
   * Postal code of the lead.  Currently it does not use strict postal code validation.
   */
  @Property()
  @IsString()
  @IsNotEmpty()
  postCode: string;

  /**
   * Date and time when the lead was created.  This is populated by the ORM, not the DB.
   */
  @Property()
  createdAt: Date = new Date();

  /**
   * Date and time when the lead was last updated.  This is populated by the ORM, not the DB.
   *
   * Identical to {@link createdAt} on creation.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  /**
   * Service types that the lead is interested in.
   */
  @Field(() => [ServiceType])
  @ManyToMany({ entity: () => ServiceType, pivotEntity: () => LeadInterest })
  serviceTypes = new Collection<ServiceType>(this);

  constructor(data: Partial<Lead>) {
    Object.assign(this, data);
  }
}
