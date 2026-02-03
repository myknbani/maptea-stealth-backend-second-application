import { Entity, EntityRepositoryType, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRepository } from '../user.repository';

/**
 * Represents user credentials without any profile attached.
 */
@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  /**
   * The unique identifier for the user.
   */
  @PrimaryKey()
  id: number;

  /**
   * The email address of the user.
   */
  @Property({ unique: true })
  username: string;

  /**
   * The hashed password of the user.
   */
  @Property()
  hashedPassword: string;

  /**
   * The date and time when the user was created.
   */
  @Property()
  createdAt: Date = new Date();

  /**
   * The date and time when the user was last updated.
   *
   * On creation, this is set to the same value as `createdAt`.
   */
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
