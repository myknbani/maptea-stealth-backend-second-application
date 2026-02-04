import { Migration } from '@mikro-orm/migrations';

export class Migration20260204105946_create_leads_related_tables extends Migration {
  override async up(): Promise<void> {
    this.addSql(/* sql */ `
      CREATE TABLE "lead" (
        "id" serial PRIMARY KEY,
        "full_name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "mobile_number" varchar(255) NOT NULL,
        "post_code" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead"
      ADD CONSTRAINT "lead_email_unique" UNIQUE ("email");
    `);

    this.addSql(/* sql */ `
      CREATE TABLE "service_type" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL
      );
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "service_type"
      ADD CONSTRAINT "service_type_name_unique" UNIQUE ("name");
    `);

    this.addSql(/* sql */ `
      CREATE TABLE "lead_interest" (
        "lead_id" int NOT NULL,
        "service_type_id" int NOT NULL,
        "created_at" timestamptz NOT NULL,
        "updated_at" timestamptz NOT NULL,
        CONSTRAINT "lead_interest_pkey" PRIMARY KEY ("lead_id", "service_type_id")
      );
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD CONSTRAINT "lead_interest_lead_id_foreign" FOREIGN key ("lead_id") REFERENCES "lead" ("id") ON UPDATE CASCADE;
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD CONSTRAINT "lead_interest_service_type_id_foreign" FOREIGN key ("service_type_id") REFERENCES "service_type" ("id") ON UPDATE CASCADE;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP CONSTRAINT "lead_interest_lead_id_foreign";
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP CONSTRAINT "lead_interest_service_type_id_foreign";
    `);

    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "lead" cascade;
    `);

    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "service_type" cascade;
    `);

    this.addSql(/* sql */ `
      DROP TABLE IF EXISTS "lead_interest" cascade;
    `);
  }
}
