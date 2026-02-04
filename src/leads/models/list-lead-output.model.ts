import { ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/common/models/page-info.model';
import { Lead } from './lead.entity';

/**
 * Model representing paginated lead listings.
 *
 * Note that `*.model.ts` is recognized by the NestJS GraphQL CLI plugin as a place
 * to look for GraphQL models that are neither object or input types.
 *
 * @see {@link https://docs.nestjs.com/graphql/cli-plugin MOdels}
 */
@ObjectType()
export class ListLeadOutput {
  /**
   * Relay-lite pagination information, but uses offset-based pagination rather than cursor-based.
   */
  pageInfo: PageInfo;

  /**
   * List of leads for the current page.
   */
  record: Lead[];

  constructor(pageInfo: PageInfo, record: Lead[]) {
    this.pageInfo = pageInfo;
    this.record = record;
  }
}
