import { Migration } from '@mikro-orm/migrations';

export class Migration20260204121529_fix_lead_interests_pivot_timestamps extends Migration {
  override async up(): Promise<void> {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      DROP COLUMN "updated_at";
    `);

    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ALTER COLUMN "created_at" type timestamptz USING ("created_at"::timestamptz);
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ALTER COLUMN "created_at"
      SET DEFAULT now();
    `);
  }

  override async down(): Promise<void> {
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ADD COLUMN "updated_at" timestamptz NOT NULL;
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ALTER COLUMN "created_at"
      DROP DEFAULT;
    `);
    this.addSql(/* sql */ `
      ALTER TABLE "lead_interest"
      ALTER COLUMN "created_at" type timestamptz USING ("created_at"::timestamptz);
    `);
  }
}
