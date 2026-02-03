import { Migration } from '@mikro-orm/migrations';

export class Migration20260203185530_create_user_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(/* sql */ `
      CREATE TABLE "user" (
        "id" serial PRIMARY KEY,
        "username" varchar(255) NOT NULL,
        "hashed_password" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "user"
      ADD CONSTRAINT "user_username_unique" UNIQUE ("username");
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "user" cascade;
    `);
  }
}
