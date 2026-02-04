import { Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { PageInfo } from '../../common/models/page-info.model';
import { ConstantsConfig } from 'src/app-config/constants-config';

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
  @IsOptional()
  itemsPerPage = ConstantsConfig.DEFAULT_PAGE_SIZE;

  /**
   * The current page number (1-based).
   */
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsOptional()
  currentPage = 1;
}
