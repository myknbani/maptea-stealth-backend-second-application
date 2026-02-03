import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { format } from 'sql-formatter';

const ADJUSTMENT_SPACES = 2;

/**
 * Formats the migration files to be more readable after generation, requiring less manual formatting.
 * The SQL cannot be formatted by Prettier since they're inside template strings.
 *
 * @see {@link https://mikro-orm.io/docs/migrations#using-custom-migrationgenerator}
 */
export class CustomMigrationGenerator extends TSMigrationGenerator {
  generateMigrationFile(className: string, diff: { up: string[]; down: string[] }): string {
    const base = super.generateMigrationFile(className, diff);

    // Sticking to whatever sql-formatter comes up with, even the newline after CREATE TABLE
    // see: https://github.com/sql-formatter-org/sql-formatter/issues/495
    const formatted = base
      .replace(/this\.addSql\(`/g, 'this.addSql(/* sql */`\n')
      .replace(/`\);\n/g, '\n    `);\n');
    return formatted;
  }

  createStatement(sql: string, padLeft: number): string {
    sql = format(sql, { language: 'postgresql', keywordCase: 'upper' });
    // a bit of indenting magic
    sql = sql
      .split('\n')
      .map((line) => `${' '.repeat(padLeft + ADJUSTMENT_SPACES)}${line}`)
      .filter((line) => line.trim().length > 0) // there are lines that just contains spaces
      .join('\n');

    return super.createStatement(sql, padLeft);
  }
}
