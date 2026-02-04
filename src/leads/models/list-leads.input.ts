import { Field, Int } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';
import { PageInfo } from '../../common/models/page-info.model';

/**
 * Model representing the input of listing leads.  Currently only has pagination, no filters.
 */
export class ListLeadsInput implements Pick<PageInfo, 'currentPage' | 'itemsPerPage'> {
  /**
   * The number of items per page.
   */
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  itemsPerPage: number;

  /**
   * The current page number (1-based).
   */
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  currentPage: number;
}
